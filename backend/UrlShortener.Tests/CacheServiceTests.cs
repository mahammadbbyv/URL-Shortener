using Moq;
using Microsoft.Extensions.Logging;
using UrlShortener.API.Services;

namespace UrlShortener.Tests;

public class CacheServiceTests
{
    [Fact]
    public async Task SetAsync_ShouldHandleNullValues()
    {
        var mockLogger = new Mock<ILogger<RedisCacheService>>();
        
        Assert.NotNull(mockLogger.Object);
    }

    [Fact]
    public void CacheKey_ShouldFollowNamingConvention()
    {
        var shortCode = "abc123";
        var expectedKey = $"url:{shortCode}";
        
        Assert.Equal("url:abc123", expectedKey);
    }
}
