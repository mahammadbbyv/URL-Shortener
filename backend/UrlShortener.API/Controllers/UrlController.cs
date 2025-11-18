using Microsoft.AspNetCore.Mvc;
using UrlShortener.API.Models.DTOs;
using UrlShortener.API.Services;

namespace UrlShortener.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UrlController : ControllerBase
{
    private readonly IUrlService _urlService;
    private readonly IQrCodeService _qrCodeService;
    private readonly IAnalyticsService _analyticsService;
    private readonly ILogger<UrlController> _logger;

    public UrlController(
        IUrlService urlService, 
        IQrCodeService qrCodeService,
        IAnalyticsService analyticsService,
        ILogger<UrlController> logger)
    {
        _urlService = urlService;
        _qrCodeService = qrCodeService;
        _analyticsService = analyticsService;
        _logger = logger;
    }

    [HttpPost("shorten")]
    public async Task<ActionResult<CreateUrlResponse>> ShortenUrl([FromBody] CreateUrlRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.OriginalUrl))
            {
                return BadRequest("URL is required");
            }

            if (!Uri.TryCreate(request.OriginalUrl, UriKind.Absolute, out _))
            {
                return BadRequest("Invalid URL format");
            }

            var baseUrl = $"{Request.Scheme}://{Request.Host}/api/url";
            var response = await _urlService.CreateShortUrlAsync(request, baseUrl);
            
            return CreatedAtAction(nameof(GetStats), new { shortCode = response.ShortCode }, response);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating short URL");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{shortCode}")]
    public async Task<IActionResult> RedirectToOriginal(string shortCode)
    {
        try
        {
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            var userAgent = Request.Headers["User-Agent"].ToString();
            var referer = Request.Headers["Referer"].ToString();
            
            var originalUrl = await _urlService.GetOriginalUrlAsync(shortCode, ipAddress, userAgent, referer);
            
            if (originalUrl == null)
            {
                return NotFound("Short URL not found or expired");
            }

            return Redirect(originalUrl);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error redirecting URL: {ShortCode}", shortCode);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("stats/{shortCode}")]
    public async Task<ActionResult<UrlStatsResponse>> GetStats(string shortCode)
    {
        try
        {
            var stats = await _urlService.GetUrlStatsAsync(shortCode);
            
            if (stats == null)
            {
                return NotFound("Short URL not found");
            }

            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting stats for: {ShortCode}", shortCode);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("qr/{shortCode}")]
    public async Task<IActionResult> GetQrCode(string shortCode, [FromQuery] int size = 10)
    {
        try
        {
            var shortUrl = await _urlService.GetUrlStatsAsync(shortCode);
            if (shortUrl == null)
            {
                return NotFound("Short URL not found");
            }

            var fullUrl = $"{Request.Scheme}://{Request.Host}/api/url/{shortCode}";
            var qrCode = _qrCodeService.GenerateQrCode(fullUrl, size);
            
            return File(qrCode, "image/png");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating QR code for: {ShortCode}", shortCode);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("analytics/{shortCode}")]
    public async Task<ActionResult<AnalyticsResponse>> GetAnalytics(string shortCode, [FromQuery] int days = 30)
    {
        try
        {
            var stats = await _urlService.GetUrlStatsAsync(shortCode);
            if (stats == null)
            {
                return NotFound("Short URL not found");
            }

            var clicksByDate = await _analyticsService.GetClicksByDateAsync(shortCode, days);
            var clicksByBrowser = await _analyticsService.GetClicksByBrowserAsync(shortCode);
            var clicksByDevice = await _analyticsService.GetClicksByDeviceAsync(shortCode);

            var response = new AnalyticsResponse
            {
                ShortCode = shortCode,
                TotalClicks = stats.AccessCount,
                ClicksByDate = clicksByDate,
                ClicksByBrowser = clicksByBrowser,
                ClicksByDevice = clicksByDevice
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting analytics for: {ShortCode}", shortCode);
            return StatusCode(500, "Internal server error");
        }
    }
}
