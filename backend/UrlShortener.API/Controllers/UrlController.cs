using Microsoft.AspNetCore.Mvc;
using UrlShortener.API.Models.DTOs;
using UrlShortener.API.Services;

namespace UrlShortener.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UrlController : ControllerBase
{
    private readonly IUrlService _urlService;
    private readonly ILogger<UrlController> _logger;

    public UrlController(IUrlService urlService, ILogger<UrlController> logger)
    {
        _urlService = urlService;
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

            var baseUrl = $"{Request.Scheme}://{Request.Host}";
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
            var originalUrl = await _urlService.GetOriginalUrlAsync(shortCode);
            
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
}
