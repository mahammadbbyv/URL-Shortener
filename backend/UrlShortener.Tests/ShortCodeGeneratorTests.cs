using Xunit;
using UrlShortener.API.Utilities;

namespace UrlShortener.Tests;

public class ShortCodeGeneratorTests
{
    [Fact]
    public void Generate_ShouldReturnSevenCharacters()
    {
        var shortCode = ShortCodeGenerator.Generate();
        
        Assert.NotNull(shortCode);
        Assert.Equal(7, shortCode.Length);
    }

    [Fact]
    public void Generate_ShouldReturnAlphanumericCharacters()
    {
        var shortCode = ShortCodeGenerator.Generate();
        
        Assert.Matches("^[a-zA-Z0-9]+$", shortCode);
    }

    [Fact]
    public void Generate_ShouldReturnDifferentCodes()
    {
        var code1 = ShortCodeGenerator.Generate();
        var code2 = ShortCodeGenerator.Generate();
        
        Assert.NotEqual(code1, code2);
    }
}
