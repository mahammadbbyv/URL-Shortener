namespace UrlShortener.API.Models.DTOs;

public class AnalyticsResponse
{
    public string ShortCode { get; set; } = string.Empty;
    public int TotalClicks { get; set; }
    public List<ClickByDate> ClicksByDate { get; set; } = new();
    public List<ClickByBrowser> ClicksByBrowser { get; set; } = new();
    public List<ClickByDevice> ClicksByDevice { get; set; } = new();
}

public class ClickByDate
{
    public string Date { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class ClickByBrowser
{
    public string Browser { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class ClickByDevice
{
    public string Device { get; set; } = string.Empty;
    public int Count { get; set; }
}
