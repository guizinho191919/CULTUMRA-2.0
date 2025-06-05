
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Restaurant } from '@/types/restaurant';
import { useFavorites } from '@/hooks/useFavorites';
import { useBackpack } from '@/hooks/useBackpack';
import { useAuth } from '@/contexts/AuthContext';
// Corrigir importação para cuisineUtils
import { getCuisineIcon, getCuisineColor } from '@/utils/cuisineUtils';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onViewDetails: (restaurant: Restaurant) => void;
}

const RestaurantCard = ({ restaurant, onViewDetails }: RestaurantCardProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addRestaurantToFavorites, removeRestaurantFromFavorites, isRestaurantFavorite } = useFavorites();
  const { addRestaurantToBackpack, isRestaurantInBackpack } = useBackpack();
  
  const isFavorite = isRestaurantFavorite(restaurant.id);
  const inBackpack = isRestaurantInBackpack(restaurant.id);
  
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

  const handleAddToBackpack = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addRestaurantToBackpack(restaurant);
  }, [isAuthenticated, navigate, restaurant, addRestaurantToBackpack]);

  const getPriceEstimate = () => {
    const prices = {
      '$': 25,
      '$$': 45,
      '$$$': 85,
      '$$$$': 150
    };
    return prices[restaurant.priceRange as keyof typeof prices] || 50;
  };

  return (
    <Card className="group overflow-hidden card-hover cursor-pointer h-full flex flex-col">
      <div 
        className="relative h-48 overflow-hidden"
        onClick={() => onViewDetails(restaurant)}
      >
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
          <Badge className={`${getCuisineColor(restaurant.cuisine)} border-0 text-xs flex items-center gap-1`}>
            <span>{getCuisineIcon(restaurant.cuisine)}</span>
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

      <CardFooter className="p-4 pt-0 space-y-2">
        <Button 
          className={`w-full h-12 ${inBackpack ? 'bg-green-600 hover:bg-green-700' : 'bg-cerrado-600 hover:bg-cerrado-700'} text-white`}
          onClick={handleAddToBackpack}
          disabled={inBackpack}
        >
          {inBackpack ? '✅ Na Mochila' : `🎒 Adicionar - R$ ${getPriceEstimate()}`}
        </Button>
        <Button 
          variant="outline"
          className="w-full"
          onClick={() => onViewDetails(restaurant)}
        >
          Ver Cardápio
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RestaurantCard;
