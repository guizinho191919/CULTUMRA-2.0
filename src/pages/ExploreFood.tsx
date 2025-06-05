
import React from 'react';
import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import CategoryFilter from '@/components/spots/CategoryFilter';
import RestaurantCard from '@/components/restaurants/RestaurantCard';
import { Button } from '@/components/ui/button';
import { mockRestaurants, cuisineCategories } from '@/data/mockRestaurants';
import { Restaurant } from '@/types/restaurant';
import { SortAsc, ChevronRight, ChevronLeft, Filter } from 'lucide-react';

const ExploreFood = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('todas');
  const [sortBy, setSortBy] = useState('relevancia');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Opções de ordenação
  const sortOptions = [
    { id: 'relevancia', name: 'Relevância', icon: '⭐' },
    { id: 'rating', name: 'Melhor Avaliação', icon: '⭐' },
    { id: 'name', name: 'Nome A-Z', icon: '🔤' },
    { id: 'price', name: 'Preço', icon: '💰' }
  ];
  
  const getCurrentSortOption = () => {
    return sortOptions.find(option => option.id === sortBy) || sortOptions[0];
  };
  
  // Categorias de culinária com contadores
  const categories = useMemo(() => {
    const baseCategories = [
      { id: 'todas', name: 'Todas', icon: '🍽️', color: 'text-cerrado-600' },
      { id: 'brasileira', name: 'Brasileira', icon: '🇧🇷', color: 'text-green-600' },
      { id: 'pantaneira', name: 'Pantaneira', icon: '🐊', color: 'text-pantanal-600' },
      { id: 'churrasco', name: 'Churrasco', icon: '🥩', color: 'text-red-600' },
      { id: 'peixe', name: 'Peixes', icon: '🐟', color: 'text-blue-600' },
      { id: 'italiana', name: 'Italiana', icon: '🍝', color: 'text-orange-600' },
      { id: 'japonesa', name: 'Japonesa', icon: '🍣', color: 'text-pink-600' },
      { id: 'lanche', name: 'Lanches', icon: '🍔', color: 'text-yellow-600' },
    ];

    return baseCategories.map(category => {
      if (category.id === 'todas') {
        return { ...category, count: mockRestaurants.length };
      }
      const count = mockRestaurants.filter(restaurant => 
        restaurant.cuisine === category.id
      ).length;
      return { ...category, count };
    });
  }, []);
  
  const filteredRestaurants = useMemo(() => {
    let restaurants = activeCategory === 'todas' 
      ? mockRestaurants 
      : mockRestaurants.filter(restaurant => restaurant.cuisine === activeCategory);
    
    // Aplicar ordenação
    if (sortBy === 'rating') {
      restaurants = restaurants.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'name') {
      restaurants = restaurants.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'price') {
      restaurants = restaurants.sort((a, b) => a.priceRange.localeCompare(b.priceRange));
    }
    
    return restaurants;
  }, [activeCategory, sortBy]);

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

  const handleViewRestaurantDetails = (restaurant: Restaurant) => {
    navigate(`/restaurant/${restaurant.id}`);
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

        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2 flex items-center justify-center gap-2">
            🍽️ Explorar Comidas
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubra os melhores restaurantes e sabores de Mato Grosso
          </p>
        </div>

        {/* Filtros Bonitos */}
        <div className="space-y-4 mb-6">
          {/* Filtros por Culinária */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Filter className="h-5 w-5 text-cerrado-600" />
                Filtrar por Culinária
              </h3>
              <div className="text-sm text-gray-600">
                {filteredRestaurants.length} restaurante{filteredRestaurants.length !== 1 ? 's' : ''} encontrado{filteredRestaurants.length !== 1 ? 's' : ''}
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
                    className={`flex items-center space-x-2 whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
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
        
        {/* Restaurants Grid */}
        <div className="mt-8">
          {filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onViewDetails={handleViewRestaurantDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Nenhum restaurante encontrado
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Não encontramos restaurantes com essas características. Tente ajustar os filtros ou explorar outras culinárias.
              </p>
              <Button 
                onClick={() => setActiveCategory('todas')}
                className="bg-cerrado-600 hover:bg-cerrado-700"
              >
                🍽️ Ver Todos os Restaurantes
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Navigation />
    </div>
  );
};

export default ExploreFood;
