
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAdminSystem } from '@/hooks/useAdminSystem';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, Search, Filter, Eye, CheckCircle, XCircle,
  CreditCard, MapPin, Users, Clock, DollarSign
} from 'lucide-react';

const ReservationsManagement = () => {
  const { reservations, updateReservation, generatePixKey, generateQRCode } = useAdminSystem();
  const [filteredReservations, setFilteredReservations] = useState(reservations);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    filterReservations();
  }, [reservations, searchTerm, statusFilter, typeFilter]);

  const filterReservations = () => {
    let filtered = reservations;

    if (searchTerm) {
      filtered = filtered.filter(reservation => 
        reservation.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.itemName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(reservation => reservation.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(reservation => reservation.itemType === typeFilter);
    }

    setFilteredReservations(filtered);
  };

  const handleConfirmReservation = (reservationId: string) => {
    updateReservation(reservationId, { 
      status: 'confirmed',
      paymentStatus: 'paid'
    });
  };

  const handleCancelReservation = (reservationId: string) => {
    updateReservation(reservationId, { 
      status: 'cancelled',
      paymentStatus: 'refunded'
    });
  };

  const handleCompleteReservation = (reservationId: string) => {
    updateReservation(reservationId, { 
      status: 'completed'
    });
  };

  const handleViewDetails = (reservation: any) => {
    toast({
      title: "Detalhes da Reserva",
      description: `Visualizando reserva de ${reservation.userName}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Pendente';
      case 'completed': return 'Concluída';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'refunded': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago';
      case 'pending': return 'Pendente';
      case 'refunded': return 'Reembolsado';
      default: return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'spot': return 'Ponto Turístico';
      case 'itinerary': return 'Roteiro';
      case 'event': return 'Evento';
      default: return type;
    }
  };

  const pendingReservations = reservations.filter(r => r.status === 'pending');
  const confirmedReservations = reservations.filter(r => r.status === 'confirmed');
  const completedReservations = reservations.filter(r => r.status === 'completed');
  const totalRevenue = reservations
    .filter(r => r.paymentStatus === 'paid')
    .reduce((sum, r) => sum + r.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Gestão de Reservas</h1>
          <p className="text-gray-600">Gerencie todas as reservas do sistema</p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold">{pendingReservations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Confirmadas</p>
                <p className="text-2xl font-bold">{confirmedReservations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Concluídas</p>
                <p className="text-2xl font-bold">{completedReservations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold">R$ {totalRevenue.toLocaleString()}</p>
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
                placeholder="Buscar por usuário ou item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status da reserva" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="confirmed">Confirmadas</SelectItem>
                <SelectItem value="completed">Concluídas</SelectItem>
                <SelectItem value="cancelled">Canceladas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de item" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="spot">Pontos Turísticos</SelectItem>
                <SelectItem value="itinerary">Roteiros</SelectItem>
                <SelectItem value="event">Eventos</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filtros Avançados</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Reservas */}
      <div className="grid grid-cols-1 gap-4">
        {filteredReservations.map((reservation) => (
          <Card key={reservation.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {reservation.userName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{reservation.itemName}</h3>
                      <Badge className={getStatusColor(reservation.status)}>
                        {getStatusLabel(reservation.status)}
                      </Badge>
                      <Badge className={getPaymentStatusColor(reservation.paymentStatus)}>
                        {getPaymentStatusLabel(reservation.paymentStatus)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <p><span className="font-medium">Cliente:</span> {reservation.userName}</p>
                        <p><span className="font-medium">Tipo:</span> {getTypeLabel(reservation.itemType)}</p>
                        <p><span className="font-medium">Data:</span> {new Date(reservation.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p><span className="font-medium">Participantes:</span> {reservation.participants}</p>
                        <p><span className="font-medium">Valor Total:</span> <span className="text-green-600 font-bold">R$ {reservation.totalAmount}</span></p>
                        <p><span className="font-medium">Criada:</span> {new Date(reservation.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleViewDetails(reservation)}
                    className="flex items-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Detalhes</span>
                  </Button>
                  
                  {reservation.status === 'pending' && (
                    <>
                      <Button 
                        size="sm"
                        onClick={() => handleConfirmReservation(reservation.id)}
                        className="flex items-center space-x-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Confirmar</span>
                      </Button>
                      <Button 
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelReservation(reservation.id)}
                        className="flex items-center space-x-2"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Cancelar</span>
                      </Button>
                    </>
                  )}
                  
                  {reservation.status === 'confirmed' && (
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleCompleteReservation(reservation.id)}
                      className="flex items-center space-x-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Concluir</span>
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => generatePixKey()}
                    className="flex items-center space-x-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Gerar PIX</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => generateQRCode(reservation.id)}
                    className="flex items-center space-x-2"
                  >
                    <span>📱</span>
                    <span>QR Code</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReservationsManagement;
