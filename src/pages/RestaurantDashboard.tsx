import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Interface para as reservas/inscrições
interface Reservation {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  partySize?: number; // Para restaurante e hotel
  roomType?: string; // Para hotel
  checkIn?: string; // Para hotel
  checkOut?: string; // Para hotel
  eventSession?: string; // Para evento
  ticketType?: string; // Para evento
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  type: 'restaurant' | 'hotel' | 'event';
}

// Interface para avaliações
interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  establishmentType: 'restaurant' | 'hotel' | 'event';
}

// Interface para galeria
interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description?: string;
  uploadDate: string;
}

const ProviderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Detectar tipo de estabelecimento baseado no usuário ou permitir seleção
  const [establishmentType, setEstablishmentType] = useState<'restaurant' | 'hotel' | 'event'>('restaurant');
  
  // Configurações dinâmicas baseadas no tipo de estabelecimento
  const config = {
    restaurant: {
      title: 'Painel do Restaurante',
      reservationLabel: 'Reservas',
      categoryLabel: 'Tipo de Culinária',
      categories: [
        { id: 'tradicional', name: 'Tradicional' },
        { id: 'pantaneira', name: 'Pantaneira' },
        { id: 'churrascaria', name: 'Churrascaria' },
        { id: 'regional', name: 'Regional' },
        { id: 'doceria', name: 'Doceria' },
        { id: 'cafe', name: 'Café' },
        { id: 'lanchonete', name: 'Lanchonete' },
        { id: 'pamonharia', name: 'Pamonharia' },
        { id: 'rodizio', name: 'Rodízio' },
        { id: 'feira', name: 'Feira' }
      ],
      reservationFields: ['partySize', 'specialRequests'],
      specificStats: {
        label1: 'Mesas Disponíveis',
        label2: 'Reservas Hoje',
        label3: 'Capacidade Total',
        label4: 'Taxa de Ocupação'
      }
    },
    hotel: {
      title: 'Painel do Hotel',
      reservationLabel: 'Reservas',
      categoryLabel: 'Tipo de Hotel',
      categories: [
        { id: 'pousada', name: 'Pousada' },
        { id: 'hotel', name: 'Hotel' },
        { id: 'resort', name: 'Resort' },
        { id: 'hostel', name: 'Hostel' },
        { id: 'boutique', name: 'Boutique Hotel' },
        { id: 'fazenda', name: 'Hotel Fazenda' }
      ],
      reservationFields: ['roomType', 'checkIn', 'checkOut', 'partySize'],
      specificStats: {
        label1: 'Quartos Disponíveis',
        label2: 'Check-ins Hoje',
        label3: 'Ocupação Atual',
        label4: 'Taxa de Ocupação'
      }
    },
    event: {
      title: 'Painel do Evento',
      reservationLabel: 'Inscrições',
      categoryLabel: 'Tipo de Evento',
      categories: [
        { id: 'cultural', name: 'Cultural' },
        { id: 'musical', name: 'Musical' },
        { id: 'gastronomico', name: 'Gastronômico' },
        { id: 'esportivo', name: 'Esportivo' },
        { id: 'educativo', name: 'Educativo' },
        { id: 'religioso', name: 'Religioso' },
        { id: 'festival', name: 'Festival' },
        { id: 'workshop', name: 'Workshop' }
      ],
      reservationFields: ['eventSession', 'ticketType', 'specialRequests'],
      specificStats: {
        label1: 'Vagas Disponíveis',
        label2: 'Inscrições Hoje',
        label3: 'Total de Inscritos',
        label4: 'Taxa de Ocupação'
      }
    }
  }[establishmentType];

  // Função para voltar à página inicial
  const handleGoHome = () => {
    navigate('/');
  };

  const [profile, setProfile] = useState({
    name: user?.name || 'Estabelecimento Demo',
    description: '',
    priceRange: '$$',
    type: establishmentType,
    category: 'tradicional',
    profileImage: null as string | null,
    contactInfo: {
      email: '',
      phone: ''
    }
  });

  const [openingHours, setOpeningHours] = useState({
    'Segunda-feira': '08:00 - 22:00',
    'Terça-feira': '08:00 - 22:00',
    'Quarta-feira': '08:00 - 22:00',
    'Quinta-feira': '08:00 - 22:00',
    'Sexta-feira': '08:00 - 23:00',
    'Sábado': '08:00 - 23:00',
    'Domingo': '08:00 - 16:00'
  });

  // Dados de exemplo específicos por tipo
  const getMockReservations = (type: 'restaurant' | 'hotel' | 'event'): Reservation[] => {
    const baseReservations = [
      {
        id: '1',
        customerName: 'João Silva',
        customerEmail: 'joao.silva@email.com',
        customerPhone: '(67) 99999-1234',
        date: '2024-01-15',
        time: '19:30',
        status: 'pending' as const,
        createdAt: '2024-01-10T10:30:00Z',
        type
      },
      {
        id: '2',
        customerName: 'Maria Santos',
        customerEmail: 'maria.santos@email.com',
        customerPhone: '(67) 98888-5678',
        date: '2024-01-16',
        time: '20:00',
        status: 'confirmed' as const,
        createdAt: '2024-01-09T14:15:00Z',
        type
      },
      {
        id: '3',
        customerName: 'Pedro Costa',
        customerEmail: 'pedro.costa@email.com',
        customerPhone: '(67) 97777-9012',
        date: '2024-01-17',
        time: '18:30',
        status: 'pending' as const,
        createdAt: '2024-01-11T09:45:00Z',
        type
      }
    ];

    return baseReservations.map(reservation => {
      switch (type) {
        case 'restaurant':
          return {
            ...reservation,
            partySize: Math.floor(Math.random() * 6) + 1,
            specialRequests: 'Mesa próxima à janela'
          };
        case 'hotel':
          return {
            ...reservation,
            roomType: ['Standard', 'Deluxe', 'Suíte'][Math.floor(Math.random() * 3)],
            checkIn: reservation.date,
            checkOut: '2024-01-17',
            partySize: Math.floor(Math.random() * 4) + 1,
            specialRequests: 'Cama extra'
          };
        case 'event':
          return {
            ...reservation,
            eventSession: ['Manhã', 'Tarde', 'Noite'][Math.floor(Math.random() * 3)],
            ticketType: ['VIP', 'Premium', 'Standard'][Math.floor(Math.random() * 3)],
            specialRequests: 'Necessidades especiais'
          };
        default:
          return reservation;
      }
    });
  };

  const [reservations, setReservations] = useState<Reservation[]>(() => getMockReservations(establishmentType));
  const [pendingReservations, setPendingReservations] = useState<Reservation[]>([]);
  const [confirmedReservations, setConfirmedReservations] = useState<Reservation[]>([]);
  const [reservationContactEmail, setReservationContactEmail] = useState('');
  const [reservationContactPhone, setReservationContactPhone] = useState('');
  const [reservationFilter, setReservationFilter] = useState('all');

  const [reviews, setReviews] = useState<Review[]>([
    { id: '1', customerName: 'Pedro Alves', rating: 5, comment: 'Comida deliciosa e atendimento excelente!', date: '2023-10-18', establishmentType: 'restaurant' },
    { id: '2', customerName: 'Mariana Costa', rating: 4, comment: 'Ótimo ambiente e pratos típicos muito bem preparados.', date: '2023-09-30', establishmentType: 'restaurant' },
    { id: '3', customerName: 'Lucas Mendes', rating: 3, comment: 'Comida boa, mas o atendimento poderia ser mais rápido.', date: '2023-09-15', establishmentType: 'restaurant' }
  ]);

  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([
    {
      id: '1',
      url: '/placeholder.svg',
      title: 'Ambiente Principal',
      description: 'Vista do salão principal do restaurante',
      uploadDate: '2023-10-01'
    },
    {
      id: '2',
      url: '/placeholder.svg',
      title: 'Prato Especial',
      description: 'Nosso prato mais famoso',
      uploadDate: '2023-10-02'
    }
  ]);

  const mockStats = {
    profileVisits: 342,
    averageRating: 4.5,
    totalReviews: 28,
    lastUpdate: '15/10/2023'
  };

  const priceRanges = [
    { id: '$', name: '$ (Econômico)' },
    { id: '$$', name: '$$ (Moderado)' },
    { id: '$$$', name: '$$$ (Caro)' },
    { id: '$$$$', name: '$$$$ (Luxo)' }
  ];

  // Atualizar reservas quando o tipo de estabelecimento mudar
  useEffect(() => {
    setReservations(getMockReservations(establishmentType));
  }, [establishmentType]);

  useEffect(() => {
    const pending = reservations.filter(res => res.status === 'pending');
    const confirmed = reservations.filter(res => res.status === 'confirmed');
    setPendingReservations(pending);
    setConfirmedReservations(confirmed);
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('restaurantReservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    const savedEmail = localStorage.getItem('reservationContactEmail');
    const savedPhone = localStorage.getItem('reservationContactPhone');
    if (savedEmail) setReservationContactEmail(savedEmail);
    if (savedPhone) setReservationContactPhone(savedPhone);
  }, []);

  // Funções de manipulação
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erro",
          description: "Por favor, selecione apenas arquivos de imagem.",
          variant: "destructive"
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "A imagem deve ter no máximo 5MB.",
          variant: "destructive"
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setProfile(prev => ({
          ...prev,
          profileImage: imageUrl
        }));
        
        toast({
          title: "Sucesso",
          description: "Foto de perfil atualizada com sucesso!"
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleGalleryUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Erro",
            description: "Por favor, selecione apenas arquivos de imagem.",
            variant: "destructive"
          });
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          const newImage: GalleryImage = {
            id: Date.now().toString(),
            url: imageUrl,
            title: file.name,
            description: '',
            uploadDate: new Date().toISOString().split('T')[0]
          };
          
          setGalleryImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      });
      
      toast({
        title: "Sucesso",
        description: "Imagens adicionadas à galeria!"
      });
    }
  };
  
  const updateReservationStatus = (id: string, status: 'confirmed' | 'cancelled') => {
    setReservations(prev => 
      prev.map(reservation => 
        reservation.id === id ? { ...reservation, status } : reservation
      )
    );
    
    const statusText = status === 'confirmed' ? 'confirmada' : 'cancelada';
    toast({
      title: "Sucesso",
      description: `Reserva ${statusText} com sucesso!`,
      variant: "default"
    });
  };
  
  const deleteReservation = (id: string) => {
    setReservations(prev => prev.filter(reservation => reservation.id !== id));
    toast({
      title: "Reserva Excluída",
      description: "A reserva foi removida com sucesso.",
      variant: "default"
    });
  };

  const removeGalleryImage = (id: string) => {
    setGalleryImages(prev => prev.filter(image => image.id !== id));
    toast({
      title: "Imagem removida",
      description: "A imagem foi removida da galeria com sucesso.",
      variant: "default"
    });
  };
  
  const getReservationsByStatus = (status: string) => {
    if (status === 'all') return reservations;
    return reservations.filter(reservation => reservation.status === status);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  const handleSaveProfile = () => {
    toast({
      title: 'Perfil atualizado',
      description: 'As informações do seu estabelecimento foram salvas com sucesso!',
      variant: 'default',
    });
  };

  const handleUpdateHours = (day: string, value: string) => {
    setOpeningHours({ ...openingHours, [day]: value });
  };

  const handleSaveReservationContacts = () => {
    localStorage.setItem('reservationContactEmail', reservationContactEmail);
    localStorage.setItem('reservationContactPhone', reservationContactPhone);
    toast({ title: "Contatos salvos", description: "Seus contatos para reservas foram salvos com sucesso!", variant: "default" });
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  // Renderizar campos específicos da reserva
  const renderReservationDetails = (reservation: Reservation) => {
    const commonDetails = (
      <>
        <p><strong>Cliente:</strong> {reservation.customerName}</p>
        <p><strong>Email:</strong> {reservation.customerEmail}</p>
        <p><strong>Telefone:</strong> {reservation.customerPhone}</p>
        <p><strong>Data:</strong> {formatDate(reservation.date)}</p>
        <p><strong>Horário:</strong> {reservation.time}</p>
      </>
    );

    const specificDetails = {
      restaurant: (
        <>
          <p><strong>Pessoas:</strong> {reservation.partySize}</p>
          {reservation.specialRequests && (
            <p><strong>Observações:</strong> {reservation.specialRequests}</p>
          )}
        </>
      ),
      hotel: (
        <>
          <p><strong>Tipo de Quarto:</strong> {reservation.roomType}</p>
          <p><strong>Check-in:</strong> {formatDate(reservation.checkIn || '')}</p>
          <p><strong>Check-out:</strong> {formatDate(reservation.checkOut || '')}</p>
          <p><strong>Hóspedes:</strong> {reservation.partySize}</p>
          {reservation.specialRequests && (
            <p><strong>Solicitações:</strong> {reservation.specialRequests}</p>
          )}
        </>
      ),
      event: (
        <>
          <p><strong>Sessão:</strong> {reservation.eventSession}</p>
          <p><strong>Tipo de Ingresso:</strong> {reservation.ticketType}</p>
          {reservation.specialRequests && (
            <p><strong>Necessidades Especiais:</strong> {reservation.specialRequests}</p>
          )}
        </>
      )
    }[establishmentType];

    return (
      <div className="space-y-2">
        {commonDetails}
        {specificDetails}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header do Dashboard */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{config.title}</h1>
            <p className="text-gray-600">Bem-vindo, {user?.name || 'Usuário'}!</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button 
              variant="outline" 
              onClick={handleGoHome}
              className="border-dourado-600 text-dourado-600 hover:bg-dourado-50"
            >
              Página Inicial
            </Button>
            <Button 
              variant="outline" 
              onClick={logout}
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              Sair
            </Button>
          </div>
        </div>

        {/* Seletor de Tipo de Estabelecimento */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-4">
              <span className="text-sm font-medium text-gray-700">Tipo de Estabelecimento:</span>
              <div className="flex gap-2">
                <Button
                  variant={establishmentType === 'restaurant' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setEstablishmentType('restaurant')}
                  className={establishmentType === 'restaurant' ? 'bg-dourado-600 hover:bg-dourado-700' : ''}
                >
                  🍽️ Restaurante
                </Button>
                <Button
                  variant={establishmentType === 'hotel' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setEstablishmentType('hotel')}
                  className={establishmentType === 'hotel' ? 'bg-dourado-600 hover:bg-dourado-700' : ''}
                >
                  🏨 Hotel
                </Button>
                <Button
                  variant={establishmentType === 'event' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setEstablishmentType('event')}
                  className={establishmentType === 'event' ? 'bg-dourado-600 hover:bg-dourado-700' : ''}
                >
                  🎉 Evento
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas Específicas por Tipo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-dourado-600">156</div>
              <p className="text-sm text-gray-600">Visualizações do Perfil</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-dourado-600">
                {establishmentType === 'restaurant' ? '24' : establishmentType === 'hotel' ? '12' : '150'}
              </div>
              <p className="text-sm text-gray-600">{config.specificStats.label1}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-dourado-600">
                {establishmentType === 'restaurant' ? '8' : establishmentType === 'hotel' ? '5' : '45'}
              </div>
              <p className="text-sm text-gray-600">{config.specificStats.label2}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-dourado-600">
                {establishmentType === 'restaurant' ? '85%' : establishmentType === 'hotel' ? '78%' : '92%'}
              </div>
              <p className="text-sm text-gray-600">{config.specificStats.label4}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Conteúdo */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="reservations">{config.reservationLabel}</TabsTrigger>
            <TabsTrigger value="reviews">Avaliações</TabsTrigger>
            <TabsTrigger value="gallery">Galeria</TabsTrigger>
          </TabsList>

          {/* Aba Perfil */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Estabelecimento</CardTitle>
                <CardDescription>Gerencie as informações básicas do seu {establishmentType === 'restaurant' ? 'restaurante' : establishmentType === 'hotel' ? 'hotel' : 'evento'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome do Estabelecimento</label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder={`Nome do seu ${establishmentType === 'restaurant' ? 'restaurante' : establishmentType === 'hotel' ? 'hotel' : 'evento'}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Descrição</label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md resize-none"
                    rows={4}
                    value={profile.description}
                    onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                    placeholder={`Descreva seu ${establishmentType === 'restaurant' ? 'restaurante, especialidades, ambiente...' : establishmentType === 'hotel' ? 'hotel, comodidades, localização...' : 'evento, programação, público-alvo...'}`}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Faixa de Preço</label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-md"
                      value={profile.priceRange}
                      onChange={(e) => setProfile({ ...profile, priceRange: e.target.value })}
                    >
                      {priceRanges.map(range => (
                        <option key={range.id} value={range.id}>{range.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{config.categoryLabel}</label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-md"
                      value={profile.category}
                      onChange={(e) => setProfile({ ...profile, category: e.target.value })}
                    >
                      {config.categories.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Informações de Contato */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Informações de Contato</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input
                        type="email"
                        value={profile.contactInfo.email}
                        onChange={(e) => setProfile({ 
                          ...profile, 
                          contactInfo: { ...profile.contactInfo, email: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Telefone</label>
                      <Input
                        value={profile.contactInfo.phone}
                        onChange={(e) => setProfile({ 
                          ...profile, 
                          contactInfo: { ...profile.contactInfo, phone: e.target.value }
                        })}
                        placeholder="(67) 99999-9999"
                      />
                    </div>
                  </div>
                  {/* Remover esta linha: </div> */}
                  {/* Campo website removido completamente */}
                </div>

                {/* Horários de Funcionamento */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Horários de Funcionamento</h3>
                  <div className="space-y-3">
                    {Object.entries(openingHours).map(([day, hours]) => (
                      <div key={day} className="flex items-center gap-4">
                        <div className="w-32 text-sm font-medium">{day}</div>
                        <Input
                          value={hours}
                          onChange={(e) => handleUpdateHours(day, e.target.value)}
                          placeholder="08:00 - 22:00"
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={handleSaveProfile} className="w-full bg-dourado-600 hover:bg-dourado-700">
                  Salvar Perfil
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Reservas/Inscrições */}
          <TabsContent value="reservations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{config.reservationLabel}</CardTitle>
                <CardDescription>
                  Gerencie as {config.reservationLabel.toLowerCase()} do seu {establishmentType === 'restaurant' ? 'restaurante' : establishmentType === 'hotel' ? 'hotel' : 'evento'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Estatísticas das Reservas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{pendingReservations.length}</div>
                    <p className="text-sm text-yellow-700">Pendentes</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{confirmedReservations.length}</div>
                    <p className="text-sm text-green-700">Confirmadas</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{reservations.length}</div>
                    <p className="text-sm text-blue-700">Total</p>
                  </div>
                </div>

                {/* Filtro de Status */}
                <div className="mb-4">
                  <select
                    className="p-2 border border-gray-300 rounded-md"
                    value={reservationFilter}
                    onChange={(e) => setReservationFilter(e.target.value)}
                  >
                    <option value="all">Todas as {config.reservationLabel}</option>
                    <option value="pending">Pendentes</option>
                    <option value="confirmed">Confirmadas</option>
                    <option value="cancelled">Canceladas</option>
                  </select>
                </div>

                {/* Lista de Reservas */}
                <div className="space-y-4">
                  {getReservationsByStatus(reservationFilter).length > 0 ? (
                    getReservationsByStatus(reservationFilter).map((reservation) => (
                      <div key={reservation.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            {renderReservationDetails(reservation)}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge 
                              variant={reservation.status === 'confirmed' ? 'default' : 
                                      reservation.status === 'pending' ? 'secondary' : 'destructive'}
                              className={reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                        reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'}
                            >
                              {reservation.status === 'confirmed' ? 'Confirmada' :
                               reservation.status === 'pending' ? 'Pendente' : 'Cancelada'}
                            </Badge>
                            {reservation.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  Confirmar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                                  className="border-red-600 text-red-600 hover:bg-red-50"
                                >
                                  Cancelar
                                </Button>
                              </div>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteReservation(reservation.id)}
                              className="border-gray-600 text-gray-600 hover:bg-gray-50"
                            >
                              Excluir
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>Nenhuma {config.reservationLabel.toLowerCase()} encontrada.</p>
                    </div>
                  )}
                </div>

                {/* Configurações de Contato para Reservas */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Configurações de Contato para {config.reservationLabel}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email para {config.reservationLabel}</label>
                      <Input
                        type="email"
                        value={reservationContactEmail}
                        onChange={(e) => setReservationContactEmail(e.target.value)}
                        placeholder="reservas@estabelecimento.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Telefone para {config.reservationLabel}</label>
                      <Input
                        value={reservationContactPhone}
                        onChange={(e) => setReservationContactPhone(e.target.value)}
                        placeholder="(67) 99999-9999"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleSaveReservationContacts}
                    className="mt-4 bg-dourado-600 hover:bg-dourado-700"
                  >
                    Salvar Contatos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Avaliações */}
          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Avaliações dos Clientes</CardTitle>
                <CardDescription>Veja o que os clientes estão dizendo sobre seu estabelecimento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{review.customerName}</h4>
                            <div className="flex items-center gap-2">
                              {renderStars(review.rating)}
                              <span className="text-sm text-gray-600">({review.rating}/5)</span>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{formatDate(review.date)}</span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>Nenhuma avaliação encontrada.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Galeria */}
          <TabsContent value="gallery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Galeria de Fotos</CardTitle>
                <CardDescription>Gerencie as fotos do seu estabelecimento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                    className="hidden"
                    id="gallery-upload"
                  />
                  <label
                    htmlFor="gallery-upload"
                    className="inline-flex items-center px-4 py-2 bg-dourado-600 text-white rounded-md hover:bg-dourado-700 cursor-pointer"
                  >
                    Adicionar Fotos
                  </label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {galleryImages.length > 0 ? (
                    galleryImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url}
                          alt={image.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeGalleryImage(image.id)}
                          >
                            Remover
                          </Button>
                        </div>
                        <div className="mt-2">
                          <h4 className="font-medium">{image.title}</h4>
                          {image.description && (
                            <p className="text-sm text-gray-600">{image.description}</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      <p>Nenhuma foto na galeria. Adicione algumas fotos para mostrar seu estabelecimento!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ProviderDashboard;