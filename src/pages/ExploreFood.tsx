
import React from 'react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import CategoryFilter from '@/components/spots/CategoryFilter';
import RestaurantCard from '@/components/restaurants/RestaurantCard';
import { Button } from '@/components/ui/button';
import { mockRestaurants, cuisineCategories } from '@/data/mockRestaurants';
import { Restaurant } from '@/types/restaurant';
import { SortAsc, ChevronRight } from 'lucide-react';

const ExploreFood = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('todas');
  const [sortBy, setSortBy] = useState('relevancia');
  const [showSortOptions, setShowSortOptions] = useState(false);
  
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
        
        <CategoryFilter 
          categories={cuisineCategories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        
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
