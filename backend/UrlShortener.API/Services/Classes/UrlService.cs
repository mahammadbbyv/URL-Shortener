using Microsoft.EntityFrameworkCore;
using UrlShortener.API.Data;
using UrlShortener.API.Models.DTOs;
using UrlShortener.API.Models.Entities;
using UrlShortener.API.Utilities;

namespace UrlShortener.API.Services;

public class UrlService : IUrlService
{
    private readonly AppDbContext _context;
    private readonly ICacheService _cache;
    private readonly IAnalyticsService _analyticsService;
    private readonly ILogger<UrlService> _logger;
    private readonly TimeSpan _cacheExpiration = TimeSpan.FromMinutes(30);

    public UrlService(AppDbContext context, ICacheService cache, IAnalyticsService analyticsService, ILogger<UrlService> logger)
    {
        _context = context;
        _cache = cache;
        _analyticsService = analyticsService;
        _logger = logger;
    }

    public async Task<CreateUrlResponse> CreateShortUrlAsync(CreateUrlRequest request, string baseUrl)
    {
        string shortCode;

        if (!string.IsNullOrWhiteSpace(request.CustomShortCode))
        {
            shortCode = request.CustomShortCode;
            var exists = await _context.ShortUrls.AnyAsync(u => u.ShortCode == shortCode);
            if (exists)
            {
                throw new InvalidOperationException("Custom short code already exists");
            }
        }
        else
        {
            shortCode = await GenerateUniqueShortCodeAsync();
        }

        var shortUrl = new ShortUrl
        {
            Id = Guid.NewGuid(),
            OriginalUrl = request.OriginalUrl,
            ShortCode = shortCode,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = request.ExpiryDays.HasValue 
                ? DateTime.UtcNow.AddDays(request.ExpiryDays.Value) 
                : null,
            AccessCount = 0
        };

        _context.ShortUrls.Add(shortUrl);
        await _context.SaveChangesAsync();

        await _cache.SetAsync($"url:{shortCode}", shortUrl.OriginalUrl, _cacheExpiration);

        _logger.LogInformation("Created short URL: {ShortCode} for {OriginalUrl}", shortCode, request.OriginalUrl);

        return new CreateUrlResponse
        {
            ShortCode = shortUrl.ShortCode,
            ShortUrl = $"{baseUrl}/{shortUrl.ShortCode}",
            OriginalUrl = shortUrl.OriginalUrl,
            CreatedAt = shortUrl.CreatedAt,
            ExpiresAt = shortUrl.ExpiresAt
        };
    }

    public async Task<string?> GetOriginalUrlAsync(string shortCode, string? ipAddress = null, string? userAgent = null, string? referer = null)
    {
        var cacheKey = $"url:{shortCode}";
        
        var shortUrl = await _context.ShortUrls
            .FirstOrDefaultAsync(u => u.ShortCode == shortCode);

        if (shortUrl == null)
        {
            return null;
        }

        if (shortUrl.ExpiresAt.HasValue && shortUrl.ExpiresAt < DateTime.UtcNow)
        {
            _logger.LogWarning("Short URL expired: {ShortCode}", shortCode);
            return null;
        }

        var cachedUrl = await _cache.GetAsync<string>(cacheKey);
        if (cachedUrl != null)
        {
            _logger.LogDebug("Cache hit for: {ShortCode}", shortCode);
        }
        else
        {
            _logger.LogDebug("Cache miss for: {ShortCode}", shortCode);
            await _cache.SetAsync(cacheKey, shortUrl.OriginalUrl, _cacheExpiration);
        }

        try
        {
            await _context.Database.ExecuteSqlRawAsync(
                "UPDATE ShortUrls SET AccessCount = AccessCount + 1, LastAccessedAt = {0} WHERE ShortCode = {1}",
                DateTime.UtcNow, shortCode);
            
            await _analyticsService.TrackClickAsync(shortUrl, ipAddress, userAgent, referer);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating access count for: {ShortCode}", shortCode);
        }

        return shortUrl.OriginalUrl;
    }

    public async Task<UrlStatsResponse?> GetUrlStatsAsync(string shortCode)
    {
        var shortUrl = await _context.ShortUrls
            .FirstOrDefaultAsync(u => u.ShortCode == shortCode);

        if (shortUrl == null)
        {
            return null;
        }

        return new UrlStatsResponse
        {
            ShortCode = shortUrl.ShortCode,
            OriginalUrl = shortUrl.OriginalUrl,
            AccessCount = shortUrl.AccessCount,
            CreatedAt = shortUrl.CreatedAt,
            LastAccessedAt = shortUrl.LastAccessedAt,
            ExpiresAt = shortUrl.ExpiresAt
        };
    }

    private async Task<string> GenerateUniqueShortCodeAsync()
    {
        string shortCode;
        int attempts = 0;
        const int maxAttempts = 10;

        do
        {
            shortCode = ShortCodeGenerator.Generate();
            attempts++;

            if (attempts > maxAttempts)
            {
                throw new InvalidOperationException("Unable to generate unique short code");
            }
        } while (await _context.ShortUrls.AnyAsync(u => u.ShortCode == shortCode));

        return shortCode;
    }
}
