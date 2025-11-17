namespace UrlShortener.API.Models.Entities;

public class ShortUrl
{
    public required Guid Id { get; set; }
    public required string OriginalUrl { get; set; }
    public required string ShortCode { get; set; }
    public required DateTime CreatedAt { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public required int AccessCount { get; set; }
    public DateTime? LastAccessedAt { get; set; }
}
