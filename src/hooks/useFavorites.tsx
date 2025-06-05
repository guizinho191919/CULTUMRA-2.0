
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { TouristSpot } from '@/types';
import { Restaurant } from '@/types/restaurant';
import { toast } from '@/hooks/use-toast';

interface FavoritesContextType {
  favoriteSpots: TouristSpot[];
  favoriteRestaurants: Restaurant[];
  addSpotToFavorites: (spot: TouristSpot) => void;
  removeSpotFromFavorites: (spotId: string) => void;
  addRestaurantToFavorites: (restaurant: Restaurant) => void;
  removeRestaurantFromFavorites: (restaurantId: string) => void;
  isSpotFavorite: (spotId: string) => boolean;
  isRestaurantFavorite: (restaurantId: string) => boolean;
  clearFavorites: () => void;
  getTotalFavorites: () => number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favoriteSpots, setFavoriteSpots] = useState<TouristSpot[]>([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<Restaurant[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedSpots = localStorage.getItem('favoriteSpots');
    const savedRestaurants = localStorage.getItem('favoriteRestaurants');
    
    if (savedSpots) {
      try {
        setFavoriteSpots(JSON.parse(savedSpots));
      } catch (error) {
        console.error('Error loading favorite spots from localStorage:', error);
      }
    }
    
    if (savedRestaurants) {
      try {
        setFavoriteRestaurants(JSON.parse(savedRestaurants));
      } catch (error) {
        console.error('Error loading favorite restaurants from localStorage:', error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favoriteSpots', JSON.stringify(favoriteSpots));
  }, [favoriteSpots]);

  useEffect(() => {
    localStorage.setItem('favoriteRestaurants', JSON.stringify(favoriteRestaurants));
  }, [favoriteRestaurants]);

  const addSpotToFavorites = (spot: TouristSpot) => {
    setFavoriteSpots(current => {
      if (current.some(s => s.id === spot.id)) {
        toast({
          title: "Já nos favoritos!",
          description: `${spot.name} já está nos seus favoritos.`,
        });
        return current;
      }

      toast({
        title: "Adicionado aos favoritos!",
        description: `${spot.name} foi adicionado aos seus favoritos.`,
      });

      return [...current, spot];
    });
  };

  const removeSpotFromFavorites = (spotId: string) => {
    setFavoriteSpots(current => current.filter(spot => spot.id !== spotId));
    toast({
      title: "Removido dos favoritos",
      description: "O destino foi removido dos seus favoritos.",
    });
  };

  const addRestaurantToFavorites = (restaurant: Restaurant) => {
    setFavoriteRestaurants(current => {
      if (current.some(r => r.id === restaurant.id)) {
        toast({
          title: "Já nos favoritos!",
          description: `${restaurant.name} já está nos seus favoritos.`,
        });
        return current;
      }

      toast({
        title: "Adicionado aos favoritos!",
        description: `${restaurant.name} foi adicionado aos seus favoritos.`,
      });

      return [...current, restaurant];
    });
  };

  const removeRestaurantFromFavorites = (restaurantId: string) => {
    setFavoriteRestaurants(current => current.filter(restaurant => restaurant.id !== restaurantId));
    toast({
      title: "Removido dos favoritos",
      description: "O restaurante foi removido dos seus favoritos.",
    });
  };

  const isSpotFavorite = (spotId: string) => {
    const result = favoriteSpots.some(spot => spot.id === spotId);
    console.log('isSpotFavorite check:', spotId, 'Result:', result, 'Current favorites:', favoriteSpots.map(s => s.id));
    return result;
  };

  const isRestaurantFavorite = (restaurantId: string) => {
    return favoriteRestaurants.some(restaurant => restaurant.id === restaurantId);
  };

  const clearFavorites = () => {
    setFavoriteSpots([]);
    setFavoriteRestaurants([]);
    toast({
      title: "Favoritos limpos!",
      description: "Todos os favoritos foram removidos.",
    });
  };

  const getTotalFavorites = () => {
    return favoriteSpots.length + favoriteRestaurants.length;
  };

  return (
    <FavoritesContext.Provider value={{
      favoriteSpots,
      favoriteRestaurants,
      addSpotToFavorites,
      removeSpotFromFavorites,
      addRestaurantToFavorites,
      removeRestaurantFromFavorites,
      isSpotFavorite,
      isRestaurantFavorite,
      clearFavorites,
      getTotalFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
