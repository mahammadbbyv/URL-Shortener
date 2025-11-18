using UrlShortener.API.Models.DTOs;

namespace UrlShortener.API.Services;

public interface IUrlService
{
    Task<CreateUrlResponse> CreateShortUrlAsync(CreateUrlRequest request, string baseUrl);
    Task<string?> GetOriginalUrlAsync(string shortCode);
    Task<UrlStatsResponse?> GetUrlStatsAsync(string shortCode);
}
