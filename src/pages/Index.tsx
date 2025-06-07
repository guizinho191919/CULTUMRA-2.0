import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import HeroSection from '@/components/home/HeroSection';
import QuickStats from '@/components/home/QuickStats';
import DestinationsSection from '@/components/home/DestinationsSection';
import FoodSection from '@/components/home/FoodSection';
import GuidesSection from '@/components/home/GuidesSection';
import ItinerariesSection from '@/components/home/ItinerariesSection';
import EventsSection from '@/components/home/EventsSection';
import CTASection from '@/components/home/CTASection';
import SupportButton from '@/components/support/SupportButton';
import { mockTouristSpots, mockGuides, mockItineraries, mockEvents, categories } from '@/data/mockData';
import { TouristSpot, Guide, Itinerary, Event } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { isAuthenticated, checkPaidReservation } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('todos');

  // Update categories with counts including spots that have multiple categories
  const categoriesWithCounts = useMemo(() => {
    return categories.map(category => {
      if (category.id === 'todos') {
        return { ...category, count: mockTouristSpots.length };
      }
      const count = mockTouristSpots.filter(spot => 
        spot.categories.includes(category.id)
      ).length;
      return { ...category, count };
    });
  }, []);

  const filteredSpots = useMemo(() => {
    if (activeCategory === 'todos') {
      return mockTouristSpots;
    }
    return mockTouristSpots.filter(spot => 
      spot.categories.includes(activeCategory)
    );
  }, [activeCategory]);

  const handleViewSpotDetails = (spot: TouristSpot) => {
    // Liberado para todos os usuários
    navigate(`/spot/${spot.id}`);
  };

  const handleViewGuideProfile = (guide: Guide) => {
    // Liberado para todos os usuários
    navigate(`/guide/${guide.id}`);
  };

  const handleStartChat = (guide: Guide) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Verificar se o usuário tem uma reserva paga com este guia
    const hasPaidReservation = checkPaidReservation(guide.id);
    
    if (!hasPaidReservation) {
      toast({
        title: "Pagamento necessário",
        description: "Você precisa contratar os serviços do guia antes de iniciar uma conversa.",
        variant: "destructive",
      });
      navigate(`/guide/${guide.id}`);
      return;
    }
    
    navigate(`/chat/${guide.id}`);
  };

  const handleViewItinerary = (itinerary: Itinerary) => {
    // Liberado para visualização, mas com restrições de interação
    // que serão implementadas na página de detalhes do roteiro
    navigate(`/itinerary/${itinerary.id}`);
  };

  const handleViewEvent = (event: Event) => {
    // Liberado para todos os usuários
    navigate(`/event/${event.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <HeroSection />

      <div className="container mx-auto px-4 py-8 space-y-12">
        <DestinationsSection
          categories={categoriesWithCounts}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          filteredSpots={filteredSpots}
          onViewSpotDetails={handleViewSpotDetails}
        />

        <FoodSection />

        <GuidesSection
          guides={mockGuides}
          onViewGuideProfile={handleViewGuideProfile}
          onStartChat={handleStartChat}
        />

        <ItinerariesSection
          itineraries={mockItineraries}
          onViewItinerary={handleViewItinerary}
        />

        <EventsSection
          events={mockEvents}
          onViewEvent={handleViewEvent}
        />

        <CTASection />
      </div>

      <Navigation />
      <SupportButton />
    </div>
  );
};

export default Index;
