using Microsoft.EntityFrameworkCore;
using UAParser;
using UrlShortener.API.Data;
using UrlShortener.API.Models.Entities;

namespace UrlShortener.API.Services;

public class AnalyticsService : IAnalyticsService
{
    private readonly AppDbContext _context;
    private readonly ILogger<AnalyticsService> _logger;

    public AnalyticsService(AppDbContext context, ILogger<AnalyticsService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task TrackClickAsync(ShortUrl shortUrl, string? ipAddress, string? userAgent, string? referer)
    {
        try
        {
            var parser = Parser.GetDefault();
            ClientInfo? clientInfo = null;
            
            if (!string.IsNullOrEmpty(userAgent))
            {
                clientInfo = parser.Parse(userAgent);
            }

            var clickEvent = new ClickEvent
            {
                Id = Guid.NewGuid(),
                ShortUrlId = shortUrl.Id,
                ShortCode = shortUrl.ShortCode,
                ClickedAt = DateTime.UtcNow,
                IpAddress = ipAddress,
                UserAgent = userAgent,
                Referer = referer,
                Browser = clientInfo?.UA.Family,
                Device = clientInfo?.Device.Family,
                OS = clientInfo?.OS.Family
            };

            _context.ClickEvents.Add(clickEvent);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error tracking click for: {ShortCode}", shortUrl.ShortCode);
        }
    }

    public async Task<Dictionary<string, int>> GetClicksByDateAsync(string shortCode, int days = 30)
    {
        var startDate = DateTime.UtcNow.AddDays(-days);
        
        var clicks = await _context.ClickEvents
            .Where(e => e.ShortCode == shortCode && e.ClickedAt >= startDate)
            .GroupBy(e => e.ClickedAt.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .OrderBy(x => x.Date)
            .ToDictionaryAsync(x => x.Date.ToString("yyyy-MM-dd"), x => x.Count);

        return clicks;
    }

    public async Task<Dictionary<string, int>> GetClicksByBrowserAsync(string shortCode)
    {
        var clicks = await _context.ClickEvents
            .Where(e => e.ShortCode == shortCode && e.Browser != null)
            .GroupBy(e => e.Browser)
            .Select(g => new { Browser = g.Key!, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .Take(10)
            .ToDictionaryAsync(x => x.Browser, x => x.Count);

        return clicks;
    }

    public async Task<Dictionary<string, int>> GetClicksByDeviceAsync(string shortCode)
    {
        var clicks = await _context.ClickEvents
            .Where(e => e.ShortCode == shortCode && e.Device != null)
            .GroupBy(e => e.Device)
            .Select(g => new { Device = g.Key!, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .Take(10)
            .ToDictionaryAsync(x => x.Device, x => x.Count);

        return clicks;
    }
}
