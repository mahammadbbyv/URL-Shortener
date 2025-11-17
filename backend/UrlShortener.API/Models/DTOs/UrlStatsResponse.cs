namespace UrlShortener.API.Models.DTOs;

public class UrlStatsResponse
{
    public required string ShortCode { get; set; }
    public required string OriginalUrl { get; set; }
    public required int AccessCount { get; set; }
    public required DateTime CreatedAt { get; set; }
    public DateTime? LastAccessedAt { get; set; }
    public DateTime? ExpiresAt { get; set; }
}
