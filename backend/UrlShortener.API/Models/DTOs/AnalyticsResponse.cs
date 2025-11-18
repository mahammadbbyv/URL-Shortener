namespace UrlShortener.API.Models.DTOs;

public class AnalyticsResponse
{
    public string ShortCode { get; set; } = string.Empty;
    public int TotalClicks { get; set; }
    public Dictionary<string, int> ClicksByDate { get; set; } = new();
    public Dictionary<string, int> ClicksByBrowser { get; set; } = new();
    public Dictionary<string, int> ClicksByDevice { get; set; } = new();
}
