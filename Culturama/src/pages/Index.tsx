
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import TouristSpotCard from '@/components/spots/TouristSpotCard';
import CategoryFilter from '@/components/spots/CategoryFilter';
import GuideCard from '@/components/guides/GuideCard';
import ItineraryCard from '@/components/itinerary/ItineraryCard';
import EventCard from '@/components/events/EventCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mockTouristSpots, mockGuides, mockItineraries, mockEvents, categories } from '@/data/mockData';
import { TouristSpot, Guide, Itinerary, Event } from '@/types';

const Index = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('todos');
  const [selectedSpot, setSelectedSpot] = useState<TouristSpot | null>(null);

  const filteredSpots = activeCategory === 'todos' 
    ? mockTouristSpots 
    : mockTouristSpots.filter(spot => spot.category === activeCategory);

  const handleViewSpotDetails = (spot: TouristSpot) => {
    navigate(`/spot/${spot.id}`);
  };

  const handleViewGuideProfile = (guide: Guide) => {
    navigate(`/guide/${guide.id}`);
  };

  const handleStartChat = (guide: Guide) => {
    navigate(`/chat/${guide.id}`);
  };

  const handleViewItinerary = (itinerary: Itinerary) => {
    navigate(`/itinerary/${itinerary.id}`);
  };

  const handleViewEvent = (event: Event) => {
    navigate(`/event/${event.id}`);
  };

  const handleViewAllEvents = () => {
    navigate('/events');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cerrado-600 via-pantanal-500 to-dourado-500">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
              Descubra o
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Mato Grosso
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Explore a natureza exuberante, cultura rica e aventuras únicas no coração do Brasil
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-cerrado-600 hover:bg-gray-100" onClick={() => navigate('/explore')}>
                🗺️ Explorar Destinos
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => navigate('/search')}>
                🧭 Encontrar Guias
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Quick Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center p-4">
            <CardContent className="p-0">
              <div className="text-2xl font-bold text-cerrado-600">{mockTouristSpots.length}</div>
              <div className="text-sm text-gray-600">Destinos</div>
            </CardContent>
          </Card>
          <Card className="text-center p-4">
            <CardContent className="p-0">
              <div className="text-2xl font-bold text-pantanal-600">{mockGuides.length}</div>
              <div className="text-sm text-gray-600">Guias Certificados</div>
            </CardContent>
          </Card>
          <Card className="text-center p-4">
            <CardContent className="p-0">
              <div className="text-2xl font-bold text-dourado-600">{mockItineraries.length}</div>
              <div className="text-sm text-gray-600">Roteiros</div>
            </CardContent>
          </Card>
          <Card className="text-center p-4">
            <CardContent className="p-0">
              <div className="text-2xl font-bold text-green-600">4.8⭐</div>
              <div className="text-sm text-gray-600">Avaliação</div>
            </CardContent>
          </Card>
        </section>

        {/* Tourist Spots Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold gradient-text">🗺️ Explore Destinos</h2>
            <Button variant="outline" onClick={() => navigate('/explore')}>Ver Todos</Button>
          </div>
          
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpots.map((spot) => (
              <TouristSpotCard
                key={spot.id}
                spot={spot}
                onViewDetails={handleViewSpotDetails}
              />
            ))}
          </div>
        </section>

        {/* Guides Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold gradient-text">🧭 Guias Especializados</h2>
            <Button variant="outline" onClick={() => navigate('/search')}>Ver Todos</Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockGuides.map((guide) => (
              <GuideCard
                key={guide.id}
                guide={guide}
                onViewProfile={handleViewGuideProfile}
                onStartChat={handleStartChat}
              />
            ))}
          </div>
        </section>

        {/* Itineraries Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold gradient-text">📍 Roteiros Recomendados</h2>
            <Button variant="outline" onClick={() => navigate('/itineraries')}>Criar Roteiro</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockItineraries.map((itinerary) => (
              <ItineraryCard
                key={itinerary.id}
                itinerary={itinerary}
                onViewDetails={handleViewItinerary}
              />
            ))}
          </div>
        </section>

        {/* Events Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold gradient-text">🎉 Eventos em Destaque</h2>
            <Button variant="outline" onClick={handleViewAllEvents}>Agenda Completa</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onViewDetails={handleViewEvent}
              />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Planeje sua próxima aventura</h3>
              <p className="text-gray-600 mb-6">
                Conecte-se com guias locais, descubra roteiros únicos e viva experiências inesquecíveis em Mato Grosso
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-cerrado-600 hover:bg-cerrado-700" onClick={() => navigate('/register')}>
                  🎯 Criar Conta
                </Button>
                <Button size="lg" variant="outline">
                  📱 Baixar App
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <Navigation />
    </div>
  );
};

export default Index;
