using UrlShortener.API.Models.DTOs;

namespace UrlShortener.API.Services;

public interface IUrlService
{
    Task<CreateUrlResponse> CreateShortUrlAsync(CreateUrlRequest request, string baseUrl);
    Task<string?> GetOriginalUrlAsync(string shortCode, string? ipAddress = null, string? userAgent = null, string? referer = null);
    Task<UrlStatsResponse?> GetUrlStatsAsync(string shortCode);
}
