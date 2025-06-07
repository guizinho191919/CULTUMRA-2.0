import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import ProfilePictureUpload from '@/components/profile/ProfilePictureUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import ProposalManagement from '@/components/guides/ProposalManagement';
import { useRealtimeReservations } from '../hooks/useRealtimeReservations';
import { useRealtimeChat } from '../hooks/useRealtimeChat';
import { RealtimeNotifications } from '../components/RealtimeNotifications';
import { useCalendarSync } from '@/hooks/useCalendarSync';

interface GuideProfile {
  name: string;
  description: string;
  languages: string[];
  specialties: string[];
  pricePerHour: number;
  location: string;
  cadasturId: string;
  rating: number;
  totalServices: number;
}

const GuideDashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  // Profile state específico para guias
  const [guideProfile, setGuideProfile] = useState<GuideProfile>({
    name: user?.name || '',
    description: 'Guia especializado em turismo sustentável e experiências autênticas em Mato Grosso.',
    languages: ['Português', 'Inglês'],
    specialties: ['Pantanal', 'Ecoturismo', 'Observação de Fauna'],
    pricePerHour: 150,
    location: 'Cuiabá, MT',
    cadasturId: 'MT-12345-G',
    rating: 4.8,
    totalServices: 24
  });
  
  // Calendar availability state
  const [availability, setAvailability] = useState<Date[]>([]);
  
  // Redirecionar se não for guia
  useEffect(() => {
    if (user && user.userType !== 'guide' && !user.email?.endsWith('@guia.com.br')) {
      navigate('/profile', { replace: true });
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível realizar o logout",
        variant: "destructive",
      });
    }
  };

  // Estatísticas específicas do guia
  const guideStats = [
    { label: 'Serviços realizados', value: guideProfile.totalServices.toString(), icon: '🧭' },
    { label: 'Avaliação média', value: guideProfile.rating.toFixed(1), icon: '⭐' },
    { label: 'Propostas pendentes', value: '3', icon: '💼' },
    { label: 'Próximos agendamentos', value: '5', icon: '📅' },
  ];

  const mockReservations = [
    {
      id: '1',
      clientName: 'Maria Silva',
      service: 'Tour Pantanal - 2 dias',
      date: '2024-01-15',
      status: 'confirmed',
      amount: 600
    },
    {
      id: '2',
      clientName: 'João Santos',
      service: 'Trilha Chapada dos Guimarães',
      date: '2024-01-20',
      status: 'pending',
      amount: 300
    }
  ];

  const recentActivity = [
    { action: 'Concluiu serviço', client: 'Ana Beatriz', date: 'Há 2 dias' },
    { action: 'Recebeu avaliação 5⭐', client: 'Carlos Mendes', date: 'Há 3 dias' },
    { action: 'Nova proposta aceita', client: 'Família Oliveira', date: 'Há 1 semana' },
  ];

  const handleSaveProfile = async () => {
    try {
      // TODO: Implement API call to save profile
      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram salvas com sucesso!',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as alterações',
        variant: 'destructive',
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6 pb-20">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🧭</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Faça login para acessar seu painel de guia
            </h3>
            <Link to="/login">
              <Button>Fazer Login</Button>
            </Link>
          </div>
        </main>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="calendar">Agenda</TabsTrigger>
            <TabsTrigger value="proposals">Propostas</TabsTrigger>
            <TabsTrigger value="reservations">Reservas</TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                  <ProfilePictureUpload />
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-2xl font-bold gradient-text">{guideProfile.name}</h1>
                    <p className="text-gray-600">{user.email}</p>
                    <div className="mt-2 space-x-2">
                      <Badge className="bg-green-100 text-green-700">
                        🧭 Guia Certificado
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-700">
                        CADASTUR: {guideProfile.cadasturId}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{guideProfile.location}</p>
                  </div>
                  <Button variant="outline" onClick={handleLogout}>
                    Sair
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {guideStats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold text-pantanal-600">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Próximas Reservas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>📅</span>
                  <span>Próximas Reservas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockReservations.map((reservation) => (
                    <div 
                      key={reservation.id} 
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-pantanal-200 to-cerrado-200 rounded-lg flex items-center justify-center">
                          <span>🧭</span>
                        </div>
                        <div>
                          <h4 className="font-medium">{reservation.service}</h4>
                          <p className="text-sm text-gray-600">
                            Cliente: {reservation.clientName} • {new Date(reservation.date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={reservation.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                          {reservation.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                        </Badge>
                        <p className="text-sm font-medium mt-1">R$ {reservation.amount.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ações Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>⚡</span>
                  <span>Ações Rápidas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left h-auto py-3 bg-green-50 hover:bg-green-100"
                  onClick={() => setActiveTab('calendar')}
                >
                  <span className="text-lg mr-3">📅</span>
                  <span className="text-sm font-medium">Gerenciar Disponibilidade</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left h-auto py-3 bg-blue-50 hover:bg-blue-100"
                  onClick={() => setActiveTab('proposals')}
                >
                  <span className="text-lg mr-3">💼</span>
                  <span className="text-sm font-medium">Ver Propostas</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left h-auto py-3 bg-purple-50 hover:bg-purple-100"
                  onClick={() => setActiveTab('profile')}
                >
                  <span className="text-lg mr-3">👤</span>
                  <span className="text-sm font-medium">Editar Perfil</span>
                </Button>
                
                <Link to="/chats" className="block">
                  <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
                    <span className="text-lg mr-3">💬</span>
                    <span className="text-sm font-medium">Mensagens</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Atividade Recente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>📈</span>
                  <span>Atividade Recente</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">
                          {activity.action} <span className="text-pantanal-600">{activity.client}</span>
                        </p>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Ver detalhes
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Perfil */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome</label>
                    <input 
                      type="text" 
                      value={guideProfile.name}
                      onChange={(e) => setGuideProfile({...guideProfile, name: e.target.value})}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Localização</label>
                    <input 
                      type="text" 
                      value={guideProfile.location}
                      onChange={(e) => setGuideProfile({...guideProfile, location: e.target.value})}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Preço por Hora (R$)</label>
                    <input 
                      type="number" 
                      value={guideProfile.pricePerHour}
                      onChange={(e) => setGuideProfile({...guideProfile, pricePerHour: Number(e.target.value)})}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CADASTUR</label>
                    <input 
                      type="text" 
                      value={guideProfile.cadasturId}
                      onChange={(e) => setGuideProfile({...guideProfile, cadasturId: e.target.value})}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Descrição</label>
                  <textarea 
                    value={guideProfile.description}
                    onChange={(e) => setGuideProfile({...guideProfile, description: e.target.value})}
                    rows={4}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <Button onClick={handleSaveProfile} className="w-full">
                  Salvar Alterações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agenda */}
          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Disponibilidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-4">Horários Disponíveis</h3>
                    <div className="space-y-2">
                      {['08:00', '10:00', '14:00', '16:00'].map((time) => (
                        <div key={time} className="flex items-center justify-between p-2 border rounded">
                          <span>{time}</span>
                          <Button variant="outline" size="sm">
                            Disponível
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Propostas */}
          <TabsContent value="proposals">
            <ProposalManagement />
          </TabsContent>

          {/* Reservas */}
          <TabsContent value="reservations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Minhas Reservas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockReservations.map((reservation) => (
                    <div key={reservation.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{reservation.service}</h4>
                        <Badge className={reservation.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                          {reservation.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">Cliente: {reservation.clientName}</p>
                      <p className="text-sm text-gray-600">Data: {new Date(reservation.date).toLocaleDateString('pt-BR')}</p>
                      <p className="text-sm font-medium">Valor: R$ {reservation.amount.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Navigation />
    </div>
  );
};

export default GuideDashboardPage;

const GuideDashboard: React.FC = () => {
  const { reservations, updateReservationStatus } = useRealtimeReservations();
  const { calendarEvents, updateBookingStatus, updateAvailability } = useCalendarSync();
  const [pendingBookings, setPendingBookings] = useState(calendarEvents.filter(e => e.status === 'pending'));

  // Função para confirmar agendamento
  const handleConfirmBooking = (eventId: string) => {
    updateBookingStatus(eventId, 'confirmed');
    setPendingBookings(prev => prev.filter(b => b.id !== eventId));
  };

  // Função para rejeitar agendamento
  const handleRejectBooking = (eventId: string, reason: string) => {
    updateBookingStatus(eventId, 'cancelled', reason);
    setPendingBookings(prev => prev.filter(b => b.id !== eventId));
  };

  // Função para atualizar disponibilidade
  const handleAvailabilityChange = (date: Date, timeSlots: string[], available: boolean) => {
    updateAvailability(date, timeSlots, available);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">📋 Solicitações Pendentes</h3>
        {pendingBookings.length === 0 ? (
          <p className="text-gray-500">Nenhuma solicitação pendente</p>
        ) : (
          <div className="space-y-4">
            {pendingBookings.map(booking => (
              <div key={booking.id} className="border rounded-lg p-4 bg-yellow-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{booking.details.serviceName}</h4>
                    <p className="text-sm text-gray-600">
                      📅 {booking.date.toLocaleDateString()} às {booking.time}
                    </p>
                    <p className="text-sm text-gray-600">📍 {booking.details.location}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleConfirmBooking(booking.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      ✓ Confirmar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleRejectBooking(booking.id, 'Horário não disponível')}
                    >
                      ✗ Rejeitar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
