
import React, { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TouristSpot } from '@/types';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';

interface TouristSpotCardProps {
  spot: TouristSpot;
  onViewDetails: (spot: TouristSpot) => void;
}

const TouristSpotCard = ({ spot, onViewDetails }: TouristSpotCardProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addSpotToFavorites, removeSpotFromFavorites, isSpotFavorite } = useFavorites();
  
  // Usar diretamente o hook sem estado local desnecessário
  const isFavorite = isSpotFavorite(spot.id);

  // Memoizar função de favoritar
  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (isFavorite) {
      removeSpotFromFavorites(spot.id);
    } else {
      addSpotToFavorites(spot);
    }
  }, [isAuthenticated, navigate, isFavorite, spot, addSpotToFavorites, removeSpotFromFavorites]);

  // Memoizar função de visualizar detalhes
  const handleViewDetailsClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails(spot);
  }, [spot, onViewDetails]);

  const handleCardClick = useCallback(() => {
    onViewDetails(spot);
  }, [spot, onViewDetails]);

  // Memoizar função de ícones
  const getCategoryIcon = useMemo(() => {
    const icons: { [key: string]: string } = {
      'natureza': '🌿',
      'aventura': '🏔️',
      'cultura': '🎭',
      'historia': '🏛️',
      'gastronomia': '🍽️',
      'ecoturismo': '🌱',
      'todos': '🗺️'
    };
    return (category: string) => icons[category.toLowerCase()] || '📍';
  }, []);

  return (
    <Card className="group overflow-hidden card-hover cursor-pointer h-full flex flex-col">
      <div className="relative h-48 overflow-hidden" onClick={handleCardClick}>
        <img
          src={spot.images[0] || '/placeholder.svg'}
          alt={spot.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Múltiplas categorias no topo esquerdo */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[60%]">
          {spot.categories.slice(0, 3).map((category, index) => (
            <Badge 
              key={index} 
              className="bg-white/90 text-gray-800 border-0 text-xs flex items-center gap-1"
            >
              <span>{getCategoryIcon(category)}</span>
              <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
            </Badge>
          ))}
          {spot.categories.length > 3 && (
            <Badge className="bg-white/90 text-gray-800 border-0 text-xs">
              +{spot.categories.length - 3}
            </Badge>
          )}
        </div>

        {/* Botão de favorito - CORAÇÃO movido para superior direito */}
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

        {/* Avaliação - ESTRELA movida para inferior esquerdo */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-white/95 px-2 py-1 rounded-full flex items-center space-x-1 shadow-sm">
            <span className="text-yellow-500">⭐</span>
            <span className="text-sm font-medium text-gray-800">{spot.rating}</span>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg mb-2 group-hover:text-cerrado-600 transition-colors line-clamp-1">
          {spot.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">
          {spot.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span className="flex items-center">
            <span className="mr-1">📍</span>
            {spot.location.city}
          </span>
          <span className="flex items-center">
            <span className="mr-1">💰</span>
            {spot.priceRange}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-cerrado-600 hover:bg-cerrado-700 text-white"
          onClick={handleViewDetailsClick}
        >
          Ver Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TouristSpotCard;
