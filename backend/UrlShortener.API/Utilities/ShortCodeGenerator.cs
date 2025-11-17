namespace UrlShortener.API.Utilities;

public static class ShortCodeGenerator
{
    private const string Alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private const int CodeLength = 7;

    public static string Generate()
    {
        var random = new Random();
        var code = new char[CodeLength];
        
        for (int i = 0; i < CodeLength; i++)
        {
            code[i] = Alphabet[random.Next(Alphabet.Length)];
        }
        
        return new string(code);
    }
}
