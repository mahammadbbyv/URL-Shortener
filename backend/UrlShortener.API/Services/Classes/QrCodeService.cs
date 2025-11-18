using QRCoder;

namespace UrlShortener.API.Services;

public class QrCodeService : IQrCodeService
{
    public byte[] GenerateQrCode(string url, int pixelsPerModule = 10)
    {
        using var qrGenerator = new QRCodeGenerator();
        using var qrCodeData = qrGenerator.CreateQrCode(url, QRCodeGenerator.ECCLevel.Q);
        using var qrCode = new PngByteQRCode(qrCodeData);
        
        return qrCode.GetGraphic(pixelsPerModule);
    }
}
