import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useBackpack } from '@/hooks/useBackpack';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { CreditCard, Tag, Wallet as WalletIcon, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Checkout = () => {
  const { items, restaurantItems, clearBackpack } = useBackpack();
  const { balance, savedCards, subtractBalance } = useWallet();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const guideBooking = location.state;

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [useWalletBalance, setUseWalletBalance] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  
  // Estados para formulários de pagamento
  const [showCardForm, setShowCardForm] = useState(false);
  const [showPixQRCode, setShowPixQRCode] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    saveCard: false
  });

  const calculateSubtotal = () => {
    // Calcular preço dos pontos turísticos
    const spotsTotal = items.reduce((total, item) => {
      const prices = {
        '$': 25,
        '$$': 65,
        '$$$': 125,
        '$$$$': 250
      };
      return total + (prices[item.spot.priceRange as keyof typeof prices] || 50);
    }, 0);

    // Calcular preço dos restaurantes
    const restaurantsTotal = restaurantItems.reduce((total, item) => {
      const prices = {
        '$': 30,
        '$$': 75,
        '$$$': 150,
        '$$$$': 300
      };
      return total + (prices[item.restaurant.priceRange as keyof typeof prices] || 60);
    }, 0);

    return spotsTotal + restaurantsTotal;
  };

  const applyCoupon = () => {
    const validCoupons = {
      'PRIMEIRA10': 10,
      'AVENTURA15': 15,
      'PANTANAL20': 20
    };

    if (validCoupons[couponCode as keyof typeof validCoupons]) {
      const discountValue = validCoupons[couponCode as keyof typeof validCoupons];
      setDiscount(discountValue);
      toast({
        title: "Cupom aplicado!",
        description: `Desconto de ${discountValue}% aplicado com sucesso.`,
      });
    } else {
      toast({
        title: "Cupom inválido",
        description: "O cupom inserido não é válido.",
        variant: "destructive",
      });
    }
  };

  const subtotal = calculateSubtotal();
  const discountAmount = (subtotal * discount) / 100;
  let total = subtotal - discountAmount;
  let walletUsed = 0;

  if (useWalletBalance) {
    walletUsed = Math.min(balance, total);
    total = total - walletUsed;
  }

  const handlePayment = () => {
    if (!selectedPayment && total > 0) {
      toast({
        title: "Selecione um método de pagamento",
        description: "Escolha uma forma de pagamento para continuar.",
        variant: "destructive",
      });
      return;
    }

    // Verificar se é cartão novo e se os dados foram preenchidos
    if ((selectedPayment === 'new-credit-card' || selectedPayment === 'new-debit-card') && 
        (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv)) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os dados do cartão para continuar.",
        variant: "destructive",
      });
      return;
    }

    // Se for PIX, mostrar QR Code
    if (selectedPayment === 'pix') {
      setShowPixQRCode(true);
      return;
    }

    // Simular processamento do pagamento
    toast({
      title: "Processando pagamento...",
      description: "Aguarde alguns instantes.",
    });

    setTimeout(() => {
      // Usar saldo da carteira se selecionado
      if (useWalletBalance && walletUsed > 0) {
        subtractBalance(walletUsed);
      }

      // Salvar cartão se solicitado
      if ((selectedPayment === 'new-credit-card' || selectedPayment === 'new-debit-card') && cardData.saveCard) {
        console.log('Salvando cartão:', cardData);
      }

      // Determinar o método de pagamento para salvar nas reservas
      let paymentMethodLabel = '';
      if (selectedPayment === 'pix') {
        paymentMethodLabel = 'pix';
      } else if (selectedPayment === 'new-credit-card') {
        paymentMethodLabel = 'new-credit-card';
      } else if (selectedPayment === 'new-debit-card') {
        paymentMethodLabel = 'new-debit-card';
      } else {
        paymentMethodLabel = `saved-card-${selectedPayment}`;
      }

      // Se for uma contratação de guia, salvar a reserva
      if (guideBooking && guideBooking.type === 'guide') {
        const guideReservation = {
          id: Date.now().toString(),
          userId: user?.id,
          guideId: guideBooking.guideId,
          guideName: guideBooking.guideName,
          amount: guideBooking.pricePerHour,
          paymentStatus: 'paid',
          paymentMethod: paymentMethodLabel,
          createdAt: new Date().toISOString(),
          type: 'guide_service'
        };
        
        const existingReservations = JSON.parse(localStorage.getItem('userReservations') || '[]');
        existingReservations.push(guideReservation);
        localStorage.setItem('userReservations', JSON.stringify(existingReservations));
      }

      // Salvar reservas no localStorage
      const existingReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
      const existingRestaurantReservations = JSON.parse(localStorage.getItem('restaurantReservations') || '[]');
      
      const newSpotReservations = items.map(item => ({
        id: `res-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        spot: item.spot,
        purchaseDate: new Date(),
        status: 'confirmed',
        totalPaid: (subtotal - discountAmount) / (items.length + restaurantItems.length),
        paymentMethod: paymentMethodLabel
      }));
      
      const newRestaurantReservations = restaurantItems.map(item => ({
        id: `res-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        restaurant: item.restaurant,
        purchaseDate: new Date(),
        status: 'confirmed',
        totalPaid: (subtotal - discountAmount) / (items.length + restaurantItems.length),
        paymentMethod: paymentMethodLabel
      }));

      localStorage.setItem('reservations', JSON.stringify([...existingReservations, ...newSpotReservations]));
      localStorage.setItem('restaurantReservations', JSON.stringify([...existingRestaurantReservations, ...newRestaurantReservations]));

      // Limpar mochila
      clearBackpack();

      toast({
        title: "Pagamento realizado com sucesso!",
        description: "Suas reservas foram confirmadas.",
      });

      navigate('/profile');
    }, 2000);
  };

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCardData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPayment(methodId);
    
    // Verificar se é um cartão salvo ou um novo método de pagamento
    const isSavedCard = savedCards.some(card => card.id === methodId);
    setSelectedCard(isSavedCard ? methodId : null);
    setShowCardForm(methodId === 'new-credit-card' || methodId === 'new-debit-card');
    setShowPixQRCode(false);
  };

  const handlePixConfirmation = () => {
    // Simular confirmação do pagamento via PIX
    toast({
      title: "Verificando pagamento PIX...",
      description: "Aguarde enquanto confirmamos seu pagamento.",
    });

    setTimeout(() => {
      // Usar saldo da carteira se selecionado
      if (useWalletBalance && walletUsed > 0) {
        subtractBalance(walletUsed);
      }

      // Salvar reservas no localStorage
      const existingReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
      const existingRestaurantReservations = JSON.parse(localStorage.getItem('restaurantReservations') || '[]');
      const existingUserReservations = JSON.parse(localStorage.getItem('userReservations') || '[]');
      
      // Verificar se é uma reserva de guia
      if (location.state?.type === 'guide') {
        const newGuideReservation = {
          id: `guide-res-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          guideId: location.state.guideId,
          guideName: location.state.guideName,
          userId: user?.email,
          purchaseDate: new Date(),
          paymentStatus: 'paid',
          totalPaid: location.state.pricePerHour,
          paymentMethod: 'pix'
        };
        
        localStorage.setItem('userReservations', JSON.stringify([...existingUserReservations, newGuideReservation]));
      }
      
      const newSpotReservations = items.map(item => ({
        id: `res-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        spot: item.spot,
        purchaseDate: new Date(),
        status: 'confirmed',
        totalPaid: (subtotal - discountAmount) / (items.length + restaurantItems.length),
        paymentMethod: 'pix'
      }));
      
      const newRestaurantReservations = restaurantItems.map(item => ({
        id: `res-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        restaurant: item.restaurant,
        purchaseDate: new Date(),
        status: 'confirmed',
        totalPaid: (subtotal - discountAmount) / (items.length + restaurantItems.length),
        paymentMethod: 'pix'
      }));

      localStorage.setItem('reservations', JSON.stringify([...existingReservations, ...newSpotReservations]));
      localStorage.setItem('restaurantReservations', JSON.stringify([...existingRestaurantReservations, ...newRestaurantReservations]));

      // Limpar mochila
      clearBackpack();

      toast({
        title: "Pagamento PIX confirmado!",
        description: "Suas reservas foram confirmadas.",
      });

      navigate('/profile');
    }, 2000);
  };

  if (items.length === 0 && restaurantItems.length === 0) {
    navigate('/backpack');
    return null;
  }

  const paymentMethods = [
    ...savedCards.map(card => ({
      id: card.id,
      name: `${card.nickname} (${card.brand.toUpperCase()} •••• ${card.lastFour})`,
      icon: '💳',
      type: 'saved-card'
    })),
    { id: 'new-credit-card', name: 'Cartão de Crédito', icon: '💳', type: 'new' },
    { id: 'new-debit-card', name: 'Cartão de Débito', icon: '💳', type: 'new' },
    { id: 'pix', name: 'PIX', icon: '📱', type: 'new' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        <div className="flex items-center space-x-2 mb-6">
          <Button variant="ghost" onClick={() => navigate('/backpack')}>
            ← Voltar
          </Button>
          <h1 className="text-2xl font-bold gradient-text">Checkout</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Resumo do Pedido */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Itens da Mochila</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Renderizar pontos turísticos */}
                {items.map((item) => {
                  const prices = {
                    '$': 25,
                    '$$': 65,
                    '$$$': 125,
                    '$$$$': 250
                  };
                  const price = prices[item.spot.priceRange as keyof typeof prices] || 50;

                  return (
                    <div key={item.spot.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-br from-cerrado-200 to-pantanal-200 rounded-lg flex items-center justify-center">
                        <span>🗺️</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.spot.name}</h4>
                        <p className="text-sm text-gray-600">{item.spot.location.city}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">R$ {price}</span>
                      </div>
                    </div>
                  );
                })}
                
                {/* Renderizar restaurantes */}
                {restaurantItems.map((item) => {
                  const prices = {
                    '$': 30,
                    '$$': 75,
                    '$$$': 150,
                    '$$$$': 300
                  };
                  const price = prices[item.restaurant.priceRange as keyof typeof prices] || 60;

                  return (
                    <div key={item.restaurant.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-200 to-red-200 rounded-lg flex items-center justify-center">
                        <span>🍽️</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.restaurant.name}</h4>
                        <p className="text-sm text-gray-600">{item.restaurant.location.city}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">R$ {price}</span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Cupom de Desconto */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Tag className="h-5 w-5" />
                  <span>Cupom de Desconto</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Digite seu cupom"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  />
                  <Button variant="outline" onClick={applyCoupon}>
                    Aplicar
                  </Button>
                </div>
                {discount > 0 && (
                  <div className="mt-2">
                    <Badge className="bg-green-100 text-green-700">
                      Desconto de {discount}% aplicado
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Pagamento */}
          <div className="space-y-6">
            {/* Saldo da Carteira */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <WalletIcon className="h-5 w-5" />
                  <span>Saldo da Carteira</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span>Saldo disponível:</span>
                  <span className="font-bold text-cerrado-600">R$ {balance.toFixed(2)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="use-wallet"
                    checked={useWalletBalance}
                    onChange={(e) => setUseWalletBalance(e.target.checked)}
                    disabled={balance === 0}
                  />
                  <label htmlFor="use-wallet" className="text-sm">
                    Usar saldo da carteira
                    {walletUsed > 0 && ` (R$ ${walletUsed.toFixed(2)})`}
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Método de Pagamento */}
            {total > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Método de Pagamento</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedPayment === method.id
                          ? 'border-cerrado-500 bg-cerrado-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handlePaymentMethodSelect(method.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{method.icon}</span>
                        <span className="font-medium">{method.name}</span>
                        {method.type === 'saved-card' && (
                          <Badge variant="outline" className="ml-auto">Salvo</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Formulário de Cartão */}
                  {showCardForm && (
                    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium">Dados do Cartão</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setShowCardForm(false)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label htmlFor="card-number" className="text-sm font-medium block mb-1">Número do Cartão</label>
                          <Input 
                            id="card-number" 
                            name="number" 
                            placeholder="0000 0000 0000 0000" 
                            value={cardData.number}
                            onChange={handleCardInputChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="card-name" className="text-sm font-medium block mb-1">Nome no Cartão</label>
                          <Input 
                            id="card-name" 
                            name="name" 
                            placeholder="Nome como está no cartão" 
                            value={cardData.name}
                            onChange={handleCardInputChange}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="card-expiry" className="text-sm font-medium block mb-1">Validade</label>
                            <Input 
                              id="card-expiry" 
                              name="expiry" 
                              placeholder="MM/AA" 
                              value={cardData.expiry}
                              onChange={handleCardInputChange}
                            />
                          </div>
                          <div>
                            <label htmlFor="card-cvv" className="text-sm font-medium block mb-1">CVV</label>
                            <Input 
                              id="card-cvv" 
                              name="cvv" 
                              placeholder="123" 
                              value={cardData.cvv}
                              onChange={handleCardInputChange}
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <input 
                            type="checkbox" 
                            id="save-card" 
                            name="saveCard"
                            checked={cardData.saveCard}
                            onChange={handleCardInputChange}
                          />
                          <label htmlFor="save-card" className="text-sm">Salvar cartão para futuras compras</label>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* QR Code PIX */}
                  {showPixQRCode && (
                    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium">Pagamento via PIX</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setShowPixQRCode(false)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-48 h-48 bg-gray-200 border flex items-center justify-center">
                          {/* Aqui seria inserido o QR Code real */}
                          <div className="text-center">
                            <span className="text-3xl">📱</span>
                            <p className="text-sm mt-2">QR Code PIX</p>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm mb-2">Valor: <strong>R$ {total.toFixed(2)}</strong></p>
                          <p className="text-xs text-gray-600 mb-4">Escaneie o QR Code com o app do seu banco ou copie a chave PIX abaixo</p>
                          <div className="flex space-x-2 mb-4">
                            <Input value="pix@mtexplorer.com.br" readOnly />
                            <Button variant="outline" onClick={() => {
                              navigator.clipboard.writeText("pix@mtexplorer.com.br");
                              toast({
                                title: "Chave PIX copiada!",
                                description: "A chave PIX foi copiada para a área de transferência.",
                              });
                            }}>
                              Copiar
                            </Button>
                          </div>
                          <Button 
                            className="w-full bg-cerrado-600 hover:bg-cerrado-700"
                            onClick={handlePixConfirmation}
                          >
                            Já realizei o pagamento
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Resumo Final */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto ({discount}%)</span>
                    <span>- R$ {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {useWalletBalance && walletUsed > 0 && (
                  <div className="flex justify-between text-blue-600">
                    <span>Saldo da carteira</span>
                    <span>- R$ {walletUsed.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Taxa de serviço</span>
                  <span>R$ 0</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total a pagar</span>
                  <span className="text-cerrado-600">R$ {total.toFixed(2)}</span>
                </div>
                <Button 
                  className="w-full mt-4 text-lg py-6 bg-cerrado-600 hover:bg-cerrado-700"
                  onClick={handlePayment}
                  disabled={showPixQRCode}
                >
                  {total === 0 ? 'Confirmar Reserva' : 'Finalizar Pagamento'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default Checkout;
