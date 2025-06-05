
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { TouristSpot } from '@/types';
import { Restaurant } from '@/types/restaurant';
import { toast } from '@/components/ui/use-toast';

interface BackpackItem {
  spot: TouristSpot;
  quantity: number;
  addedAt: Date;
}

interface RestaurantBackpackItem {
  restaurant: Restaurant;
  quantity: number;
  addedAt: Date;
}

interface BackpackContextType {
  items: BackpackItem[];
  restaurantItems: RestaurantBackpackItem[];
  addToBackpack: (spot: TouristSpot) => void;
  addRestaurantToBackpack: (restaurant: Restaurant) => void;
  removeFromBackpack: (spotId: string) => void;
  removeRestaurantFromBackpack: (restaurantId: string) => void;
  clearBackpack: () => void;
  getTotalItems: () => number;
  isInBackpack: (spotId: string) => boolean;
  isRestaurantInBackpack: (restaurantId: string) => boolean;
}

const BackpackContext = createContext<BackpackContextType | undefined>(undefined);

export const BackpackProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<BackpackItem[]>([]);
  const [restaurantItems, setRestaurantItems] = useState<RestaurantBackpackItem[]>([]);

  // Load backpack from localStorage on mount
  useEffect(() => {
    const savedBackpack = localStorage.getItem('backpack');
    const savedRestaurantBackpack = localStorage.getItem('restaurantBackpack');
    
    if (savedBackpack) {
      try {
        const parsedItems = JSON.parse(savedBackpack);
        setItems(parsedItems.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        })));
      } catch (error) {
        console.error('Error loading backpack from localStorage:', error);
      }
    }
    
    if (savedRestaurantBackpack) {
      try {
        const parsedItems = JSON.parse(savedRestaurantBackpack);
        setRestaurantItems(parsedItems.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        })));
      } catch (error) {
        console.error('Error loading restaurant backpack from localStorage:', error);
      }
    }
  }, []);

  // Save backpack to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('backpack', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('restaurantBackpack', JSON.stringify(restaurantItems));
  }, [restaurantItems]);

  const addToBackpack = (spot: TouristSpot) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.spot.id === spot.id);
      
      if (existingItem) {
        toast({
          title: "Já na mochila!",
          description: `${spot.name} já está na sua mochila.`,
          variant: "default",
        });
        return currentItems;
      }

      toast({
        title: "Adicionado à mochila!",
        description: `${spot.name} foi adicionado à sua mochila.`,
        variant: "default",
      });

      return [...currentItems, {
        spot,
        quantity: 1,
        addedAt: new Date()
      }];
    });
  };

  const addRestaurantToBackpack = (restaurant: Restaurant) => {
    setRestaurantItems(currentItems => {
      const existingItem = currentItems.find(item => item.restaurant.id === restaurant.id);
      
      if (existingItem) {
        toast({
          title: "Já na mochila!",
          description: `${restaurant.name} já está na sua mochila.`,
          variant: "default",
        });
        return currentItems;
      }

      toast({
        title: "Adicionado à mochila!",
        description: `${restaurant.name} foi adicionado à sua mochila.`,
        variant: "default",
      });

      return [...currentItems, {
        restaurant,
        quantity: 1,
        addedAt: new Date()
      }];
    });
  };

  const removeFromBackpack = (spotId: string) => {
    setItems(currentItems => currentItems.filter(item => item.spot.id !== spotId));
  };

  const removeRestaurantFromBackpack = (restaurantId: string) => {
    setRestaurantItems(currentItems => currentItems.filter(item => item.restaurant.id !== restaurantId));
  };

  const clearBackpack = () => {
    setItems([]);
    setRestaurantItems([]);
    toast({
      title: "Mochila limpa!",
      description: "Todos os itens foram removidos da sua mochila.",
      variant: "default",
    });
  };

  const getTotalItems = () => {
    const spotItems = items.reduce((total, item) => total + item.quantity, 0);
    const restaurantItemsCount = restaurantItems.reduce((total, item) => total + item.quantity, 0);
    return spotItems + restaurantItemsCount;
  };

  const isInBackpack = (spotId: string) => {
    return items.some(item => item.spot.id === spotId);
  };

  const isRestaurantInBackpack = (restaurantId: string) => {
    return restaurantItems.some(item => item.restaurant.id === restaurantId);
  };

  return (
    <BackpackContext.Provider value={{
      items,
      restaurantItems,
      addToBackpack,
      addRestaurantToBackpack,
      removeFromBackpack,
      removeRestaurantFromBackpack,
      clearBackpack,
      getTotalItems,
      isInBackpack,
      isRestaurantInBackpack
    }}>
      {children}
    </BackpackContext.Provider>
  );
};

export const useBackpack = () => {
  const context = useContext(BackpackContext);
  if (context === undefined) {
    throw new Error('useBackpack must be used within a BackpackProvider');
  }
  return context;
};
