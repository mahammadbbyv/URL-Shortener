namespace UrlShortener.API.Models.Entities;

public class ClickEvent
{
    public Guid Id { get; set; }
    public Guid ShortUrlId { get; set; }
    public string ShortCode { get; set; } = string.Empty;
    public DateTime ClickedAt { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string? Referer { get; set; }
    public string? Browser { get; set; }
    public string? Device { get; set; }
    public string? OS { get; set; }
    
    public ShortUrl ShortUrl { get; set; } = null!;
}
