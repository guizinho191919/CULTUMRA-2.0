
import React, { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Restaurant } from '@/types/restaurant';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';
import { getCuisineIcon, getCuisineColor, getTodayHours } from '@/utils/cuisineUtils';

interface FoodRestaurantCardProps {
  restaurant: Restaurant;
}

const FoodRestaurantCard = React.memo(({ restaurant }: FoodRestaurantCardProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addRestaurantToFavorites, removeRestaurantFromFavorites, isRestaurantFavorite } = useFavorites();

  const isFavorite = isRestaurantFavorite(restaurant.id);

  // Memoizar valores computados
  const cuisineIcon = useMemo(() => getCuisineIcon(restaurant.cuisine), [restaurant.cuisine]);
  const cuisineColor = useMemo(() => getCuisineColor(restaurant.cuisine), [restaurant.cuisine]);
  const todayHours = useMemo(() => getTodayHours(restaurant.openingHours), [restaurant.openingHours]);
  
  // Memoizar especialidades limitadas
  const limitedSpecialties = useMemo(() => {
    return restaurant.specialties.slice(0, 2);
  }, [restaurant.specialties]);

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isFavorite) {
      removeRestaurantFromFavorites(restaurant.id);
    } else {
      addRestaurantToFavorites(restaurant);
    }
  }, [isAuthenticated, navigate, isFavorite, restaurant, addRestaurantToFavorites, removeRestaurantFromFavorites]);

  const handleNavigateToRestaurant = useCallback(() => {
    navigate(`/restaurant/${restaurant.id}`);
  }, [navigate, restaurant.id]);

  return (
    <Card className="group overflow-hidden card-hover cursor-pointer h-full flex flex-col">
      <div className="relative h-48 overflow-hidden" onClick={handleNavigateToRestaurant}>
        <img
          src={restaurant.images[0]}
          alt={restaurant.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop';
          }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Badge de categoria no topo esquerdo */}
        <div className="absolute top-3 left-3">
          <Badge className={`${cuisineColor} border-0 text-xs flex items-center gap-1`}>
            <span>{cuisineIcon}</span>
            <span>{restaurant.cuisine.charAt(0).toUpperCase() + restaurant.cuisine.slice(1)}</span>
          </Badge>
        </div>
        
        {/* Coração no topo direito */}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={handleFavoriteClick}
            className="p-2 rounded-full shadow-sm transition-all duration-200 bg-white/95 hover:bg-white"
          >
            <span className={`text-lg transition-colors duration-200 ${
              isFavorite ? 'text-red-500' : 'text-gray-400'
            }`}>
              {isFavorite ? '❤️' : '🤍'}
            </span>
          </button>
        </div>

        {/* Avaliação no inferior esquerdo */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-white/95 px-2 py-1 rounded-full flex items-center space-x-1 shadow-sm">
            <span className="text-yellow-500">⭐</span>
            <span className="text-sm font-medium text-gray-800">{restaurant.rating}</span>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg mb-2 group-hover:text-cerrado-600 transition-colors line-clamp-1">
          {restaurant.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">
          {restaurant.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span className="flex items-center">
            <span className="mr-1">📍</span>
            {restaurant.location.city}
          </span>
          <span className="flex items-center">
            <span className="mr-1">💰</span>
            {restaurant.priceRange}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-cerrado-600 hover:bg-cerrado-700 text-white"
          onClick={handleNavigateToRestaurant}
        >
          Ver Cardápio
        </Button>
      </CardFooter>
    </Card>
  );
});

FoodRestaurantCard.displayName = 'FoodRestaurantCard';

export default FoodRestaurantCard;
