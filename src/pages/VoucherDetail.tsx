import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, Calendar, MapPin, Clock, Share2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VoucherDetail = () => {
  const { id, type } = useParams<{ id: string, type: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [voucher, setVoucher] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar dados do voucher baseado no ID e tipo
    const loadVoucherData = () => {
      setLoading(true);
      try {
        let reservationData;
        
        if (type === 'spot') {
          const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
          reservationData = reservations.find((res: any) => res.id === id);
        } else if (type === 'restaurant') {
          const reservations = JSON.parse(localStorage.getItem('restaurantReservations') || '[]');
          reservationData = reservations.find((res: any) => res.id === id);
        }

        if (reservationData) {
          // Gerar código QR único baseado no ID da reserva
          const qrCodeData = `MT-EXPLORER-${id}-${Date.now()}`;
          
          setVoucher({
            ...reservationData,
            qrCodeData,
            validUntil: new Date(new Date().setDate(new Date().getDate() + 30)).toLocaleDateString('pt-BR'),
            voucherNumber: `VC-${id.substring(0, 8).toUpperCase()}`
          });
        } else {
          toast({
            title: "Voucher não encontrado",
            description: "Não foi possível encontrar os detalhes deste voucher.",
            variant: "destructive",
          });
          navigate('/profile');
        }
      } catch (error) {
        console.error("Erro ao carregar dados do voucher:", error);
        toast({
          title: "Erro ao carregar voucher",
          description: "Ocorreu um erro ao carregar os detalhes do voucher.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadVoucherData();
  }, [id, type, navigate, toast]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Voucher MT Explorer - ${voucher.voucherNumber}`,
        text: `Meu voucher para ${type === 'spot' ? voucher.spot.name : voucher.restaurant.name}`,
        url: window.location.href,
      }).catch((error) => console.log('Erro ao compartilhar', error));
    } else {
      // Fallback para navegadores que não suportam Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copiado!",
        description: "O link do voucher foi copiado para a área de transferência.",
      });
    }
  };

  const handleDownload = () => {
    // Simulação de download do voucher
    toast({
      title: "Voucher baixado",
      description: "O voucher foi salvo na sua galeria.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6 pb-20 flex justify-center items-center">
          <div className="text-center py-12">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-gray-200 h-16 w-16 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </main>
        <Navigation />
      </div>
    );
  }

  if (!voucher) return null;

  const itemData = type === 'spot' ? voucher.spot : voucher.restaurant;
  const itemIcon = type === 'spot' ? '🗺️' : '🍽️';
  const gradientClass = type === 'spot' 
    ? 'from-cerrado-200 to-pantanal-200' 
    : 'from-orange-200 to-red-200';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        <div className="flex items-center space-x-2 mb-6">
          <Button variant="ghost" onClick={() => navigate('/profile')}>
            ← Voltar
          </Button>
          <h1 className="text-2xl font-bold gradient-text">Seu Voucher</h1>
        </div>

        {/* Voucher Card */}
        <Card className="mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-cerrado-500 to-pantanal-500 p-4 text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">MT Explorer</h2>
              <Badge className="bg-white text-cerrado-700">
                {voucher.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
              </Badge>
            </div>
            <p className="text-sm opacity-80">Voucher #{voucher.voucherNumber}</p>
          </div>
          
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* QR Code */}
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-white">
                <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center mb-2">
                  <QrCode className="h-36 w-36 text-gray-800" />
                </div>
                <p className="text-sm text-center text-gray-500 mt-2">Escaneie este QR code para validar seu voucher</p>
              </div>

              {/* Detalhes do Voucher */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${gradientClass} rounded-lg flex items-center justify-center`}>
                    <span className="text-xl">{itemIcon}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{itemData.name}</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{itemData.location.city}, {itemData.location.state}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-cerrado-600" />
                    <div>
                      <p className="text-sm font-medium">Data da Compra</p>
                      <p className="text-sm text-gray-600">{new Date(voucher.purchaseDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-cerrado-600" />
                    <div>
                      <p className="text-sm font-medium">Válido até</p>
                      <p className="text-sm text-gray-600">{voucher.validUntil}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="font-medium mb-1">Informações importantes:</p>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                    <li>Apresente este voucher na entrada do local</li>
                    <li>Documento de identificação com foto é obrigatório</li>
                    <li>Chegue com pelo menos 15 minutos de antecedência</li>
                    <li>Este voucher é pessoal e intransferível</li>
                  </ul>
                </div>

                <div className="pt-4 border-t">
                  <p className="font-medium mb-2">Valor pago:</p>
                  <p className="text-xl font-bold text-cerrado-600">R$ {voucher.totalPaid.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">
                    Método de pagamento: {voucher.paymentMethod === 'pix' ? 'PIX' : 
                      voucher.paymentMethod === 'new-credit-card' ? 'Cartão de Crédito' : 
                      voucher.paymentMethod === 'new-debit-card' ? 'Cartão de Débito' : 'Outro'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4 mt-6">
              <Button 
                variant="outline" 
                className="flex items-center space-x-2"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                <span>Compartilhar</span>
              </Button>
              <Button 
                className="flex items-center space-x-2 bg-cerrado-600 hover:bg-cerrado-700"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                <span>Baixar Voucher</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instruções */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Como usar seu voucher</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-cerrado-100 p-2 rounded-full">
                <span className="text-lg">1</span>
              </div>
              <div>
                <h4 className="font-medium">Apresente seu voucher</h4>
                <p className="text-sm text-gray-600">Mostre o QR code na entrada do local ou para o guia responsável</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-cerrado-100 p-2 rounded-full">
                <span className="text-lg">2</span>
              </div>
              <div>
                <h4 className="font-medium">Validação</h4>
                <p className="text-sm text-gray-600">O QR code será escaneado para confirmar a validade do voucher</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-cerrado-100 p-2 rounded-full">
                <span className="text-lg">3</span>
              </div>
              <div>
                <h4 className="font-medium">Aproveite sua experiência</h4>
                <p className="text-sm text-gray-600">Após a validação, você está pronto para desfrutar da sua reserva</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Navigation />
    </div>
  );
};

export default VoucherDetail;