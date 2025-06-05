
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import PixPayment from '@/components/wallet/PixPayment';
import AddCardForm from '@/components/wallet/AddCardForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Wallet as WalletIcon, Plus, Trash2, ArrowLeft } from 'lucide-react';

const Wallet = () => {
  const { balance, savedCards, addBalance, addCard, removeCard } = useWallet();
  const { toast } = useToast();
  const [addBalanceAmount, setAddBalanceAmount] = useState('');
  const [showAddCard, setShowAddCard] = useState(false);
  const [showPixPayment, setShowPixPayment] = useState(false);
  const [pixAmount, setPixAmount] = useState(0);

  const handleInitiatePix = () => {
    const amount = parseFloat(addBalanceAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Valor inválido",
        description: "Digite um valor válido para adicionar ao saldo.",
        variant: "destructive",
      });
      return;
    }

    setPixAmount(amount);
    setShowPixPayment(true);
  };

  const handlePixSuccess = (amount: number) => {
    addBalance(amount);
    setShowPixPayment(false);
    setAddBalanceAmount('');
  };

  const handlePixCancel = () => {
    setShowPixPayment(false);
    setPixAmount(0);
  };

  const handleAddCard = (cardData: any) => {
    addCard(cardData);
    setShowAddCard(false);
    toast({
      title: "Cartão adicionado!",
      description: "O cartão foi salvo com sucesso.",
    });
  };

  const handleRemoveCard = (cardId: string) => {
    removeCard(cardId);
    toast({
      title: "Cartão removido",
      description: "O cartão foi removido da sua carteira.",
    });
  };

  if (showPixPayment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6 pb-20">
          <div className="flex items-center space-x-2 mb-6">
            <Button variant="ghost" onClick={handlePixCancel}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold gradient-text">Pagamento PIX</h1>
          </div>
          <PixPayment 
            amount={pixAmount}
            onCancel={handlePixCancel}
            onSuccess={handlePixSuccess}
          />
        </main>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        <div className="flex items-center space-x-2 mb-6">
          <h1 className="text-2xl font-bold gradient-text flex items-center space-x-2">
            <WalletIcon className="h-6 w-6" />
            <span>Minha Carteira</span>
          </h1>
        </div>

        <Tabs defaultValue="balance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="balance">Saldo</TabsTrigger>
            <TabsTrigger value="cards">Cartões Salvos</TabsTrigger>
          </TabsList>

          <TabsContent value="balance">
            <div className="space-y-6">
              {/* Saldo Atual */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>💰</span>
                    <span>Saldo Disponível</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <div className="text-4xl font-bold text-cerrado-600 mb-2">
                      R$ {balance.toFixed(2)}
                    </div>
                    <p className="text-gray-600">Disponível para uso</p>
                  </div>
                </CardContent>
              </Card>

              {/* Adicionar Saldo */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Adicionar Saldo</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Valor (R$)
                    </label>
                    <Input
                      type="number"
                      placeholder="0,00"
                      value={addBalanceAmount}
                      onChange={(e) => setAddBalanceAmount(e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[50, 100, 200].map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        onClick={() => setAddBalanceAmount(amount.toString())}
                      >
                        R$ {amount}
                      </Button>
                    ))}
                  </div>
                  <Button 
                    onClick={handleInitiatePix}
                    className="w-full bg-cerrado-600 hover:bg-cerrado-700"
                  >
                    Pagar via PIX
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cards">
            <div className="space-y-6">
              {/* Header com botão */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Cartões Salvos</h3>
                <Button 
                  onClick={() => setShowAddCard(!showAddCard)}
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Cartão
                </Button>
              </div>

              {/* Formulário de adicionar cartão */}
              {showAddCard && (
                <AddCardForm
                  onSave={handleAddCard}
                  onCancel={() => setShowAddCard(false)}
                />
              )}

              {/* Lista de cartões */}
              {savedCards.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhum cartão salvo
                    </h3>
                    <p className="text-gray-600">
                      Adicione cartões para facilitar suas compras futuras.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {savedCards.map((card) => (
                    <Card key={card.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-8 bg-gradient-to-r from-cerrado-500 to-pantanal-500 rounded flex items-center justify-center">
                              <CreditCard className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-medium">{card.nickname}</h4>
                              <p className="text-sm text-gray-600">
                                {card.brand.toUpperCase()} •••• {card.lastFour}
                              </p>
                              <p className="text-xs text-gray-500">
                                {card.holderName}
                              </p>
                              <p className="text-xs text-gray-500">
                                Válido até {card.expiryMonth.toString().padStart(2, '0')}/{card.expiryYear}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveCard(card.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Navigation />
    </div>
  );
};

export default Wallet;
