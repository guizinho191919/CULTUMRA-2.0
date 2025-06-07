import { useState } from 'react';
import { format } from 'date-fns';

export interface ScheduledItem {
  id: string;
  date: Date;
  price: number;
}

interface SelectedItem {
  id: string;
  name: string;
  type: 'spot' | 'restaurant';
}

const specialDates = {
  '2024-12-25': { multiplier: 2.0, name: 'Natal' },
  '2024-12-31': { multiplier: 2.5, name: 'Réveillon' },
  '2024-01-01': { multiplier: 2.5, name: 'Ano Novo' },
  '2024-02-13': { multiplier: 1.8, name: 'Carnaval' },
  '2024-06-24': { multiplier: 1.5, name: 'São João' },
  '2024-10-12': { multiplier: 1.3, name: 'Nossa Senhora Aparecida' },
  '2024-09-07': { multiplier: 1.2, name: 'Independência' },
};

export const useBackpackScheduling = () => {
  const [scheduledSpots, setScheduledSpots] = useState<ScheduledItem[]>([]);
  const [scheduledRestaurants, setScheduledRestaurants] = useState<ScheduledItem[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const calculatePriceForDate = (basePrice: number, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const specialDate = specialDates[dateStr as keyof typeof specialDates];
    
    if (specialDate) {
      return Math.round(basePrice * specialDate.multiplier);
    }
    
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return Math.round(basePrice * 1.2);
    }
    
    return basePrice;
  };

  const getBasePrice = (priceRange: string, type: 'spot' | 'restaurant') => {
    const spotPrices = { '$': 25, '$$': 65, '$$$': 125, '$$$$': 250 };
    const restaurantPrices = { '$': 30, '$$': 80, '$$$': 150, '$$$$': 300 };
    
    const prices = type === 'spot' ? spotPrices : restaurantPrices;
    return prices[priceRange as keyof typeof prices] || (type === 'spot' ? 50 : 60);
  };

  const getDateInfo = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const specialDate = specialDates[dateStr as keyof typeof specialDates];
    
    if (specialDate) {
      return { isSpecial: true, name: specialDate.name, multiplier: specialDate.multiplier };
    }
    
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return { isSpecial: true, name: 'Fim de semana', multiplier: 1.2 };
    }
    
    return { isSpecial: false, name: '', multiplier: 1.0 };
  };

  const getSchedulingInfo = (id: string, type: 'spot' | 'restaurant') => {
    const scheduled = type === 'spot' 
      ? scheduledSpots.find(s => s.id === id)
      : scheduledRestaurants.find(s => s.id === id);
    return scheduled;
  };

  const openCalendar = (id: string, name: string, type: 'spot' | 'restaurant') => {
    setSelectedItem({ id, name, type });
    setIsCalendarOpen(true);
    setSelectedDate(undefined);
  };

  const confirmScheduling = (items: any[], restaurantItems: any[]) => {
    if (!selectedDate || !selectedItem) {
      console.log('Dados insuficientes:', { selectedDate, selectedItem });
      return;
    }

    const item = selectedItem.type === 'spot' 
      ? items.find(i => i.spot.id === selectedItem.id)
      : restaurantItems.find(i => i.restaurant.id === selectedItem.id);
    
    if (!item) {
      console.log('Item não encontrado:', selectedItem);
      return;
    }

    const priceRange = selectedItem.type === 'spot' 
      ? ('spot' in item ? item.spot.priceRange : '$')
      : ('restaurant' in item ? item.restaurant.priceRange : '$');
    
    const basePrice = getBasePrice(priceRange, selectedItem.type);
    const finalPrice = calculatePriceForDate(basePrice, selectedDate);

    const scheduledItem: ScheduledItem = {
      id: selectedItem.id,
      date: selectedDate,
      price: finalPrice
    };

    if (selectedItem.type === 'spot') {
      setScheduledSpots(prev => [
        ...prev.filter(s => s.id !== selectedItem.id),
        scheduledItem
      ]);
    } else {
      setScheduledRestaurants(prev => [
        ...prev.filter(s => s.id !== selectedItem.id),
        scheduledItem
      ]);
    }
    
    setIsCalendarOpen(false);
    setSelectedItem(null);
    setSelectedDate(undefined);
  };

  return {
    scheduledSpots,
    scheduledRestaurants,
    isCalendarOpen,
    selectedItem,
    selectedDate,
    setIsCalendarOpen,
    setSelectedDate,
    calculatePriceForDate,
    getBasePrice,
    getDateInfo,
    getSchedulingInfo,
    openCalendar,
    confirmScheduling
  };
};