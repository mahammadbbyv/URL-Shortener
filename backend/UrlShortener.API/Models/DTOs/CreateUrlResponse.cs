namespace UrlShortener.API.Models.DTOs;

public class CreateUrlResponse
{
    public required string ShortCode { get; set; }
    public required string ShortUrl { get; set; }
    public required string OriginalUrl { get; set; }
    public required DateTime CreatedAt { get; set; }
    public DateTime? ExpiresAt { get; set; }
}
