import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ProposalManagement from '@/components/guides/ProposalManagement';

interface Profile {
  name: string;
  description: string;
  languages: string[];
  specialties: string[];
  pricePerHour: number;
  location: string;
  cadasturId: string;
}

interface Region {
  id: string;
  name: string;
  categories: string[];
}

const GuideDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  // Profile form state
  const [profile, setProfile] = useState<Profile>({
    name: user?.name || '',
    description: '',
    languages: [],
    specialties: [],
    pricePerHour: 0,
    location: '',
    cadasturId: ''
  });
  
  // Calendar availability state
  const [availability, setAvailability] = useState<Date[]>([]);
  
  // Regions state
  const [regions, setRegions] = useState<Region[]>([]);

  const mockStats = {
    totalServices: 24,
    averageRating: 4.8,
    upcomingAppointments: 3,
    pendingRequests: 2
  };

  const mockReviews = [
    { id: '1', userName: 'Maria Silva', rating: 5, comment: 'Excelente guia! Conhece muito bem a região do Pantanal.', date: '2023-10-15' },
    { id: '2', userName: 'João Pereira', rating: 4, comment: 'Ótima experiência na Chapada dos Guimarães.', date: '2023-09-22' }
  ];

  const mockChats = [
    { id: '1', userName: 'Carlos Mendes', lastMessage: 'Olá, gostaria de saber sobre disponibilidade para o próximo final de semana.', time: '14:30' },
    { id: '2', userName: 'Ana Beatriz', lastMessage: 'Obrigada pelas informações!', time: '09:15' }
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

  const handleAddRegion = (region: Region) => {
    setRegions(prevRegions => [...prevRegions, region]);
  };

  const handleRemoveRegion = (regionId: string) => {
    setRegions(prevRegions => prevRegions.filter(r => r.id !== regionId));
  };

  const handleToggleAvailability = (date: Date) => {
    setAvailability(prevAvailability => {
      const isAvailable = prevAvailability.some(d => d.getTime() === date.getTime());
      if (isAvailable) {
        return prevAvailability.filter(d => d.getTime() !== date.getTime());
      }
      return [...prevAvailability, date];
    });
  };

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

  const handleGoHome = () => {
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="calendar">Agenda</TabsTrigger>
              <TabsTrigger value="stats">Estatísticas</TabsTrigger>
              <TabsTrigger value="reviews">Avaliações</TabsTrigger>
              <TabsTrigger value="messages">Mensagens</TabsTrigger>
            </TabsList>

            {/* Add your tab contents here */}
          </Tabs>
        );
      case 'availability':
        return (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="calendar">Agenda</TabsTrigger>
              <TabsTrigger value="stats">Estatísticas</TabsTrigger>
              <TabsTrigger value="reviews">Avaliações</TabsTrigger>
              <TabsTrigger value="messages">Mensagens</TabsTrigger>
            </TabsList>

            {/* Add your tab contents here */}
          </Tabs>
        );
      case 'proposals': // Nova aba
        return <ProposalManagement />;
      case 'reservations':
        return (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="calendar">Agenda</TabsTrigger>
              <TabsTrigger value="stats">Estatísticas</TabsTrigger>
              <TabsTrigger value="reviews">Avaliações</TabsTrigger>
              <TabsTrigger value="messages">Mensagens</TabsTrigger>
            </TabsList>

            {/* Add your tab contents here */}
          </Tabs>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="calendar">Agenda</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            <TabsTrigger value="reviews">Avaliações</TabsTrigger>
            <TabsTrigger value="messages">Mensagens</TabsTrigger>
          </TabsList>

          {/* Add your tab contents here */}
        </Tabs>
      </main>
      
      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-white p-1 rounded-lg shadow-sm">
        {[
          { id: 'profile', label: 'Perfil', icon: '👤' },
          { id: 'availability', label: 'Disponibilidade', icon: '📅' },
          { id: 'proposals', label: 'Propostas', icon: '💼' },
          { id: 'reservations', label: 'Reservas', icon: '📋' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-pantanal-600 text-white'
                : 'text-gray-600 hover:text-pantanal-600 hover:bg-pantanal-50'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {renderContent()}
      <Navigation />
    </div>
  );
};

export default GuideDashboard;
