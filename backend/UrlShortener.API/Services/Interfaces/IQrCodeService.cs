using QRCoder;

namespace UrlShortener.API.Services;

public interface IQrCodeService
{
    byte[] GenerateQrCode(string url, int pixelsPerModule = 10);
}
