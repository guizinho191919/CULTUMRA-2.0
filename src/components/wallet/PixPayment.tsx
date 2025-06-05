
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, CheckCircle, Clock, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PixPaymentProps {
  amount: number;
  onCancel: () => void;
  onSuccess: (amount: number) => void;
}

const PixPayment = ({ amount, onCancel, onSuccess }: PixPaymentProps) => {
  const { toast } = useToast();
  const [status, setStatus] = useState<'pending' | 'confirmed'>('pending');
  const [pixCode, setPixCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos

  // Simular geração do código PIX
  useEffect(() => {
    const generatePixCode = () => {
      const randomCode = `00020126580014br.gov.bcb.pix0136${Math.random().toString(36).substr(2, 32)}52040000530398654${amount.toFixed(2).replace('.', '')}5802BR5925Mato Grosso Guide6009SAO PAULO62070503***6304${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      setPixCode(randomCode);
    };
    generatePixCode();
  }, [amount]);

  // Countdown timer
  useEffect(() => {
    if (status === 'pending' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, status]);

  // Simular confirmação de pagamento após 10 segundos
  useEffect(() => {
    if (status === 'pending') {
      const timer = setTimeout(() => {
        setStatus('confirmed');
        onSuccess(amount);
        toast({
          title: "Pagamento confirmado!",
          description: `R$ ${amount.toFixed(2)} foram adicionados à sua carteira.`,
        });
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [status, amount, onSuccess, toast]);

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    toast({
      title: "Código copiado!",
      description: "O código PIX foi copiado para a área de transferência.",
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          <QrCode className="h-6 w-6" />
          <span>Pagamento PIX</span>
        </CardTitle>
        <div className="flex items-center justify-center space-x-2">
          <Badge variant={status === 'confirmed' ? 'default' : 'secondary'}>
            {status === 'pending' ? (
              <>
                <Clock className="h-3 w-3 mr-1" />
                Aguardando pagamento
              </>
            ) : (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Confirmado
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-cerrado-600 mb-2">
            R$ {amount.toFixed(2)}
          </div>
          {status === 'pending' && (
            <p className="text-sm text-gray-600">
              Tempo restante: {formatTime(timeLeft)}
            </p>
          )}
        </div>

        {status === 'pending' && (
          <>
            {/* QR Code simulado */}
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <div className="w-48 h-48 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                <QrCode className="h-24 w-24 text-gray-400" />
              </div>
            </div>

            {/* Código PIX */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Chave PIX (Copia e Cola)
              </label>
              <div className="flex space-x-2">
                <div className="flex-1 p-3 bg-gray-50 border rounded-md text-xs font-mono break-all">
                  {pixCode}
                </div>
                <Button onClick={copyPixCode} variant="outline" size="sm">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="text-xs text-gray-500 text-center space-y-1">
              <p>• Abra o app do seu banco</p>
              <p>• Escaneie o QR Code ou cole a chave PIX</p>
              <p>• Confirme o pagamento</p>
            </div>
          </>
        )}

        {status === 'confirmed' && (
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-green-700">
                Pagamento Confirmado!
              </h3>
              <p className="text-gray-600">
                O saldo foi adicionado à sua carteira.
              </p>
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          {status === 'pending' && (
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
          )}
          {status === 'confirmed' && (
            <Button onClick={onCancel} className="flex-1">
              Finalizar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PixPayment;
