
import { useToast } from '@/hooks/use-toast';

export const usePaymentUtils = () => {
  const { toast } = useToast();

  const generatePixKey = () => {
    const pixKey = `mato-grosso-guide-${Date.now()}`;
    toast({
      title: "Chave PIX gerada",
      description: `Chave: ${pixKey}`,
    });
    return pixKey;
  };

  const generateQRCode = (data: string) => {
    const qrData = `QR-${data}-${Date.now()}`;
    toast({
      title: "QR Code gerado",
      description: "QR Code criado com sucesso."
    });
    return qrData;
  };

  return {
    generatePixKey,
    generateQRCode
  };
};
