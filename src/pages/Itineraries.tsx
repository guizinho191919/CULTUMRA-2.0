import React from 'react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import ItineraryCard from '@/components/itinerary/ItineraryCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SortAsc, ChevronRight } from 'lucide-react';
import { mockItineraries } from '@/data/mockData';
import { Itinerary } from '@/types';

const Itineraries = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showSortOptions, setShowSortOptions] = useState(false);

  // Opções de ordenação
  const sortOptions = [
    { id: 'name', name: 'Nome A-Z', icon: '🔤' },
    { id: 'duration', name: 'Duração', icon: '⏱️' },
    { id: 'rating', name: 'Melhor Avaliação', icon: '⭐' },
    { id: 'price', name: 'Preço', icon: '💰' }
  ];
  
  const getCurrentSortOption = () => {
    return sortOptions.find(option => option.id === sortBy) || sortOptions[0];
  };

  const filteredAndSortedItineraries = useMemo(() => {
    let filtered = mockItineraries.filter(itinerary =>
      itinerary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      itinerary.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      itinerary.destinations.some(destination => 
        destination.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'duration':
          return parseInt(a.duration) - parseInt(b.duration);
        case 'rating':
          return (b.guide?.rating || 0) - (a.guide?.rating || 0);
        default:
          return 0;
      }
    });
  }, [searchTerm, sortBy]);

  const handleViewItinerary = (itinerary: Itinerary) => {
    navigate(`/itinerary/${itinerary.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          ← Voltar
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">📍 Todos os Roteiros</h1>
          <p className="text-gray-600 text-lg">Descubra roteiros incríveis pelo Mato Grosso</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar roteiros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Sorting Component from GuideFilters */}
        <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
          <div className="flex items-center gap-2">
            <SortAsc className="h-5 w-5 text-cerrado-600" />
            <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
          </div>
          
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSortOptions(!showSortOptions)}
              className="flex items-center gap-2 min-w-[160px] justify-between hover:bg-cerrado-50 hover:border-cerrado-300"
            >
              <span className="flex items-center gap-2">
                <span>{getCurrentSortOption().icon}</span>
                <span className="text-sm">{getCurrentSortOption().name}</span>
              </span>
              <ChevronRight className={`h-4 w-4 transition-transform ${
                showSortOptions ? 'rotate-90' : ''
              }`} />
            </Button>
            
            {showSortOptions && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[160px]">
                {sortOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSortBy(option.id);
                      setShowSortOptions(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-cerrado-50 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                      sortBy === option.id ? 'bg-cerrado-100 text-cerrado-700 font-medium' : 'text-gray-700'
                    }`}
                  >
                    <span>{option.icon}</span>
                    <span>{option.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Lista de Roteiros */}
        <div className="mt-8">
          {filteredAndSortedItineraries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedItineraries.map((itinerary) => (
                <ItineraryCard
                  key={itinerary.id}
                  itinerary={itinerary}
                  onViewDetails={handleViewItinerary}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Nenhum roteiro encontrado
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Não encontramos roteiros com essas características. Tente ajustar os filtros ou termos de busca.
              </p>
              <Button 
                onClick={() => setSearchTerm('')}
                className="bg-cerrado-600 hover:bg-cerrado-700"
              >
                📍 Ver Todos os Roteiros
              </Button>
            </div>
          )}
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default Itineraries;