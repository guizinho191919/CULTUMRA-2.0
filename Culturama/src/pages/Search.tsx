
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import CategoryFilter from '@/components/spots/CategoryFilter';
import TouristSpotCard from '@/components/spots/TouristSpotCard';
import GuideCard from '@/components/guides/GuideCard';
import EventCard from '@/components/events/EventCard';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockTouristSpots, mockGuides, mockEvents } from '@/data/mockData';

const searchCategories = [
  { id: 'todos', name: 'Todos', icon: '🔍', count: 0 },
  { id: 'destinos', name: 'Destinos', icon: '🗺️', count: mockTouristSpots.length },
  { id: 'guias', name: 'Guias', icon: '🧭', count: mockGuides.length },
  { id: 'eventos', name: 'Eventos', icon: '🎉', count: mockEvents.length },
];

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Get search query from URL
  const urlParams = new URLSearchParams(location.search);
  const queryFromUrl = urlParams.get('q') || '';

  useState(() => {
    if (queryFromUrl) {
      setSearchTerm(queryFromUrl);
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with search term
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleViewSpotDetails = (spot: any) => {
    navigate(`/spot/${spot.id}`);
  };

  const handleViewGuideProfile = (guide: any) => {
    navigate(`/guide/${guide.id}`);
  };

  const handleStartChat = (guide: any) => {
    navigate(`/chat/${guide.id}`);
  };

  const handleViewEvent = (event: any) => {
    navigate(`/event/${event.id}`);
  };

  const filteredResults = () => {
    const query = searchTerm.toLowerCase();
    
    if (activeCategory === 'todos' || activeCategory === 'destinos') {
      const spots = mockTouristSpots.filter(spot => 
        spot.name.toLowerCase().includes(query) ||
        spot.description.toLowerCase().includes(query) ||
        spot.location.city.toLowerCase().includes(query)
      );
      return { spots, guides: [], events: [] };
    }
    
    if (activeCategory === 'guias') {
      const guides = mockGuides.filter(guide =>
        guide.name.toLowerCase().includes(query) ||
        guide.description.toLowerCase().includes(query) ||
        guide.specialties.some(s => s.toLowerCase().includes(query))
      );
      return { spots: [], guides, events: [] };
    }
    
    if (activeCategory === 'eventos') {
      const events = mockEvents.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.address.toLowerCase().includes(query)
      );
      return { spots: [], guides: [], events };
    }

    return { spots: [], guides: [], events: [] };
  };

  const results = filteredResults();
  const totalResults = results.spots.length + results.guides.length + results.events.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold gradient-text mb-2">Buscar</h1>
          <p className="text-gray-600">Encontre destinos, guias e eventos em Mato Grosso</p>
        </div>

        {/* Search Form */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Digite sua busca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">
                Buscar
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="mb-6">
          <CategoryFilter
            categories={searchCategories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* Results */}
        {searchTerm && (
          <div className="mb-4">
            <p className="text-gray-600">
              {totalResults} resultado{totalResults !== 1 ? 's' : ''} encontrado{totalResults !== 1 ? 's' : ''} para "{searchTerm}"
            </p>
          </div>
        )}

        {/* Tourist Spots Results */}
        {results.spots.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">🗺️</span>
              Destinos ({results.spots.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.spots.map((spot) => (
                <TouristSpotCard
                  key={spot.id}
                  spot={spot}
                  onViewDetails={handleViewSpotDetails}
                />
              ))}
            </div>
          </div>
        )}

        {/* Guides Results */}
        {results.guides.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">🧭</span>
              Guias ({results.guides.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {results.guides.map((guide) => (
                <GuideCard
                  key={guide.id}
                  guide={guide}
                  onViewProfile={handleViewGuideProfile}
                  onStartChat={handleStartChat}
                />
              ))}
            </div>
          </div>
        )}

        {/* Events Results */}
        {results.events.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">🎉</span>
              Eventos ({results.events.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onViewDetails={handleViewEvent}
                />
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {searchTerm && totalResults === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum resultado encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                Tente buscar por outros termos ou explore nossas categorias
              </p>
              <Button onClick={() => navigate('/explore')}>
                Explorar Destinos
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Default Content when no search */}
        {!searchTerm && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Comece sua busca
            </h3>
            <p className="text-gray-600">
              Digite acima para encontrar destinos, guias e eventos incríveis
            </p>
          </div>
        )}
      </main>

      <Navigation />
    </div>
  );
};

export default Search;
