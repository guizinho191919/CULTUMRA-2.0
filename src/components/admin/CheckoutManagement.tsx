
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { 
  ShoppingCart, Search, Filter, Eye, CheckCircle, XCircle,
  CreditCard, Calendar, MapPin, User, DollarSign
} from 'lucide-react';

interface CheckoutItem {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  items: {
    id: string;
    name: string;
    type: 'spot' | 'itinerary' | 'event';
    price: number;
    date?: string;
  }[];
  paymentMethod: 'pix' | 'credit_card' | 'wallet' | 'multiple';
  totalAmount: number;
  discountApplied?: number;
  couponUsed?: string;
  createdAt: string;
  completedAt?: string;
}

const CheckoutManagement = () => {
  const [checkouts, setCheckouts] = useState<CheckoutItem[]>([]);
  const [filteredCheckouts, setFilteredCheckouts] = useState<CheckoutItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    loadCheckouts();
  }, []);

  useEffect(() => {
    filterCheckouts();
  }, [checkouts, searchTerm, statusFilter, paymentFilter]);

  const loadCheckouts = () => {
    const mockCheckouts: CheckoutItem[] = [
      {
        id: '1',
        userId: '1',
        userName: 'João Silva',
        userEmail: 'joao@email.com',
        status: 'completed',
        items: [
          { id: '1', name: 'Pantanal Adventure', type: 'itinerary', price: 450, date: '2024-06-15' },
          { id: '2', name: 'Chapada dos Guimarães', type: 'spot', price: 150 }
        ],
        paymentMethod: 'credit_card',
        totalAmount: 540,
        discountApplied: 60,
        couponUsed: 'DESCONTO10',
        createdAt: '2024-05-28T10:30:00',
        completedAt: '2024-05-28T10:32:00'
      },
      {
        id: '2',
        userId: '2',
        userName: 'Maria Santos',
        userEmail: 'maria@email.com',
        status: 'pending',
        items: [
          { id: '3', name: 'Festival de Inverno', type: 'event', price: 80, date: '2024-07-20' }
        ],
        paymentMethod: 'pix',
        totalAmount: 80,
        createdAt: '2024-05-29T14:15:00'
      }
    ];
    setCheckouts(mockCheckouts);
  };

  const filterCheckouts = () => {
    let filtered = checkouts;

    if (searchTerm) {
      filtered = filtered.filter(checkout => 
        checkout.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        checkout.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        checkout.couponUsed?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(checkout => checkout.status === statusFilter);
    }

    if (paymentFilter !== 'all') {
      filtered = filtered.filter(checkout => checkout.paymentMethod === paymentFilter);
    }

    setFilteredCheckouts(filtered);
  };

  const handleApprovePayment = (checkoutId: string) => {
    setCheckouts(prev => prev.map(c => 
      c.id === checkoutId 
        ? { ...c, status: 'completed', completedAt: new Date().toISOString() }
        : c
    ));
    toast({
      title: "Pagamento aprovado",
      description: "O checkout foi marcado como concluído."
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      case 'cancelled': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'pending': return 'Pendente';
      case 'failed': return 'Falhou';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'pix': return 'PIX';
      case 'credit_card': return 'Cartão de Crédito';
      case 'wallet': return 'Carteira';
      case 'multiple': return 'Múltiplos';
      default: return method;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Gestão de Checkout</h1>
          <p className="text-gray-600">Visualize e gerencie todos os checkouts realizados</p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Concluídos</p>
                <p className="text-2xl font-bold">{checkouts.filter(c => c.status === 'completed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold">{checkouts.filter(c => c.status === 'pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <XCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Falharam</p>
                <p className="text-2xl font-bold">{checkouts.filter(c => c.status === 'failed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold">R$ {checkouts.reduce((sum, c) => sum + c.totalAmount, 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por usuário ou cupom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="completed">Concluídos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="failed">Falharam</SelectItem>
                <SelectItem value="cancelled">Cancelados</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os métodos</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="credit_card">Cartão</SelectItem>
                <SelectItem value="wallet">Carteira</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filtros Avançados</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Checkouts */}
      <div className="grid grid-cols-1 gap-4">
        {filteredCheckouts.map((checkout) => (
          <Card key={checkout.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {checkout.userName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{checkout.userName}</h3>
                      <Badge className={getStatusColor(checkout.status)}>
                        {getStatusLabel(checkout.status)}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <p>Email: {checkout.userEmail}</p>
                      <p>Pagamento: {getPaymentMethodLabel(checkout.paymentMethod)}</p>
                      <p>Data: {new Date(checkout.createdAt).toLocaleString()}</p>
                      {checkout.completedAt && (
                        <p>Concluído: {new Date(checkout.completedAt).toLocaleString()}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Itens do checkout:</h4>
                      {checkout.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            {item.date && (
                              <p className="text-xs text-gray-600">
                                Data: {new Date(item.date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <p className="font-bold text-green-600">R$ {item.price}</p>
                        </div>
                      ))}
                    </div>

                    {checkout.couponUsed && (
                      <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                        <p className="text-sm">
                          <span className="font-medium">Cupom usado:</span> {checkout.couponUsed}
                          {checkout.discountApplied && (
                            <span className="text-green-600 ml-2">
                              (-R$ {checkout.discountApplied})
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-green-600">R$ {checkout.totalAmount}</p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>Ver Detalhes</span>
                    </Button>
                    {checkout.status === 'pending' && (
                      <Button 
                        size="sm"
                        onClick={() => handleApprovePayment(checkout.id)}
                        className="flex items-center space-x-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Aprovar</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CheckoutManagement;
