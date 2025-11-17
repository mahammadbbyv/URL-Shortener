namespace UrlShortener.API.Models.Entities;

public class ShortUrl
{
    public Guid Id { get; set; }
    public string OriginalUrl { get; set; } = string.Empty;
    public string ShortCode { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public int AccessCount { get; set; }
    public DateTime? LastAccessedAt { get; set; }
}
