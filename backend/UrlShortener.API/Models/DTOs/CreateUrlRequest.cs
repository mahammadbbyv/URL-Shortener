namespace UrlShortener.API.Models.DTOs;

public class CreateUrlRequest
{
    public required string OriginalUrl { get; set; }
    public required string? CustomShortCode { get; set; }
    public int? ExpiryDays { get; set; }
}
