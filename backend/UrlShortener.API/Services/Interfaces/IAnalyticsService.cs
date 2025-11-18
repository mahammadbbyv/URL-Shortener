using UrlShortener.API.Models.Entities;

namespace UrlShortener.API.Services;

public interface IAnalyticsService
{
    Task TrackClickAsync(ShortUrl shortUrl, string? ipAddress, string? userAgent, string? referer);
    Task<Dictionary<string, int>> GetClicksByDateAsync(string shortCode, int days = 30);
    Task<Dictionary<string, int>> GetClicksByBrowserAsync(string shortCode);
    Task<Dictionary<string, int>> GetClicksByDeviceAsync(string shortCode);
}
