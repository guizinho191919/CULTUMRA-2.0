import React from 'react';
import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import ItineraryCard from '@/components/itinerary/ItineraryCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SortAsc, ChevronRight, ChevronLeft, Filter } from 'lucide-react';
import { mockItineraries } from '@/data/mockData';
import { Itinerary } from '@/types';

const Itineraries = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');
  const [sortBy, setSortBy] = useState('name');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  // Categorias de roteiros com contadores
  const categories = useMemo(() => {
    const baseCategories = [
      { id: 'todos', name: 'Todos', icon: '📍', color: 'text-cerrado-600' },
      { id: 'aventura', name: 'Aventura', icon: '🏃', color: 'text-orange-600' },
      { id: 'natureza', name: 'Natureza', icon: '🌿', color: 'text-green-600' },
      { id: 'cultura', name: 'Cultura', icon: '🏛️', color: 'text-purple-600' },
      { id: 'gastronomia', name: 'Gastronomia', icon: '🍽️', color: 'text-red-600' },
      { id: 'relaxamento', name: 'Relaxamento', icon: '🧘', color: 'text-blue-600' },
    ];

    return baseCategories.map(category => {
      if (category.id === 'todos') {
        return { ...category, count: mockItineraries.length };
      }
      
      let count = 0;
      switch (category.id) {
        case 'aventura':
          count = mockItineraries.filter(itinerary => 
            itinerary.title.toLowerCase().includes('aventura') ||
            itinerary.description.toLowerCase().includes('aventura') ||
            itinerary.destinations.some(dest => dest.toLowerCase().includes('trilha'))
          ).length;
          break;
        case 'natureza':
          count = mockItineraries.filter(itinerary => 
            itinerary.title.toLowerCase().includes('natureza') ||
            itinerary.description.toLowerCase().includes('natureza') ||
            itinerary.destinations.some(dest => 
              dest.toLowerCase().includes('pantanal') ||
              dest.toLowerCase().includes('parque')
            )
          ).length;
          break;
        case 'cultura':
          count = mockItineraries.filter(itinerary => 
            itinerary.title.toLowerCase().includes('cultura') ||
            itinerary.description.toLowerCase().includes('cultura') ||
            itinerary.destinations.some(dest => 
              dest.toLowerCase().includes('museu') ||
              dest.toLowerCase().includes('histórico')
            )
          ).length;
          break;
        case 'gastronomia':
          count = mockItineraries.filter(itinerary => 
            itinerary.title.toLowerCase().includes('gastronomia') ||
            itinerary.description.toLowerCase().includes('culinária') ||
            itinerary.destinations.some(dest => dest.toLowerCase().includes('restaurante'))
          ).length;
          break;
        case 'relaxamento':
          count = mockItineraries.filter(itinerary => 
            itinerary.title.toLowerCase().includes('relaxamento') ||
            itinerary.description.toLowerCase().includes('spa') ||
            itinerary.destinations.some(dest => dest.toLowerCase().includes('resort'))
          ).length;
          break;
      }
      return { ...category, count };
    });
  }, []);

  const filteredAndSortedItineraries = useMemo(() => {
    let filtered = mockItineraries.filter(itinerary =>
      itinerary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      itinerary.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      itinerary.destinations.some(destination => 
        destination.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    // Aplicar filtro de categoria
    if (activeCategory !== 'todos') {
      switch (activeCategory) {
        case 'aventura':
          filtered = filtered.filter(itinerary => 
            itinerary.title.toLowerCase().includes('aventura') ||
            itinerary.description.toLowerCase().includes('aventura') ||
            itinerary.destinations.some(dest => dest.toLowerCase().includes('trilha'))
          );
          break;
        case 'natureza':
          filtered = filtered.filter(itinerary => 
            itinerary.title.toLowerCase().includes('natureza') ||
            itinerary.description.toLowerCase().includes('natureza') ||
            itinerary.destinations.some(dest => 
              dest.toLowerCase().includes('pantanal') ||
              dest.toLowerCase().includes('parque')
            )
          );
          break;
        case 'cultura':
          filtered = filtered.filter(itinerary => 
            itinerary.title.toLowerCase().includes('cultura') ||
            itinerary.description.toLowerCase().includes('cultura') ||
            itinerary.destinations.some(dest => 
              dest.toLowerCase().includes('museu') ||
              dest.toLowerCase().includes('histórico')
            )
          );
          break;
        case 'gastronomia':
          filtered = filtered.filter(itinerary => 
            itinerary.title.toLowerCase().includes('gastronomia') ||
            itinerary.description.toLowerCase().includes('culinária') ||
            itinerary.destinations.some(dest => dest.toLowerCase().includes('restaurante'))
          );
          break;
        case 'relaxamento':
          filtered = filtered.filter(itinerary => 
            itinerary.title.toLowerCase().includes('relaxamento') ||
            itinerary.description.toLowerCase().includes('spa') ||
            itinerary.destinations.some(dest => dest.toLowerCase().includes('resort'))
          );
          break;
      }
    }

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
  }, [searchTerm, activeCategory, sortBy]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

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
          <h1 className="text-4xl font-bold gradient-text mb-4 text-center">📍 Todos os Roteiros</h1>
          <p className="text-gray-600 text-lg text-center">Descubra roteiros incríveis pelo Mato Grosso</p>
        </div>

        {/* Filtros Bonitos */}
        <div className="space-y-4 mb-6">
          {/* Filtros por Categoria */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Filter className="h-5 w-5 text-cerrado-600" />
                Filtrar por Categoria
              </h3>
              <div className="text-sm text-gray-600">
                {filteredAndSortedItineraries.length} roteiro{filteredAndSortedItineraries.length !== 1 ? 's' : ''} encontrado{filteredAndSortedItineraries.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full">
              {/* Botão de seta esquerda */}
              <Button
                variant="ghost"
                size="icon"
                onClick={scrollLeft}
                className="bg-cerrado-500 hover:bg-cerrado-600 h-8 w-8 rounded-full shadow-lg flex-shrink-0 md:hidden"
              >
                <ChevronLeft className="h-4 w-4 text-white" />
              </Button>

              {/* Container dos filtros */}
              <div 
                ref={scrollRef}
                className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide flex-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={activeCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 whitespace-nowrap min-w-fit ${
                      activeCategory === category.id
                        ? 'bg-cerrado-600 hover:bg-cerrado-700 text-white shadow-lg'
                        : 'hover:bg-cerrado-50 hover:text-cerrado-700 hover:border-cerrado-300 bg-white'
                    }`}
                  >
                    <span className="text-base">{category.icon}</span>
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      activeCategory === category.id 
                        ? 'bg-white/20 text-white' 
                        : `bg-gray-100 ${category.color}`
                    }`}>
                      {category.count}
                    </span>
                  </Button>
                ))}
              </div>

              {/* Botão de seta direita */}
              <Button
                variant="ghost"
                size="icon"
                onClick={scrollRight}
                className="bg-cerrado-500 hover:bg-cerrado-600 h-8 w-8 rounded-full shadow-lg flex-shrink-0 md:hidden"
              >
                <ChevronRight className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>

          {/* Ordenação */}
          <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
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
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('todos');
                }}
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