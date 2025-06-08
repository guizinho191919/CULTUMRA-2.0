import { useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { mockTouristSpots, mockGuides } from '@/data/mockData';
import { mockRestaurants } from '@/data/mockRestaurants';
import { mockItineraries } from '@/data/mockData';
import { isWithinInterval, parseISO } from 'date-fns';

interface SearchFilters {
  searchTerm: string;
  category: string;
  dateRange?: DateRange;
  interests: string[];
  priceRange?: [number, number];
}

export const useAdvancedSearch = (filters: SearchFilters) => {
  const results = useMemo(() => {
    const { searchTerm, category, dateRange, interests } = filters;
    const query = searchTerm.toLowerCase();

    // Função para verificar disponibilidade na data
    const isAvailableInDateRange = (availability: any[], dateRange?: DateRange) => {
      if (!dateRange?.from || !availability?.length) return true;
      
      // Lógica para verificar se o item está disponível no período selecionado
      // Implementar baseado na estrutura de disponibilidade de cada tipo
      return true;
    };

    let spots = [];
    let guides = [];
    let restaurants = [];
    let itineraries = [];

    // Filtrar destinos/pontos turísticos
    if (category === 'todos' || category === 'destinos') {
      spots = mockTouristSpots.filter(spot => {
        const matchesSearch = !query || 
          spot.name.toLowerCase().includes(query) ||
          spot.description.toLowerCase().includes(query) ||
          spot.location.city.toLowerCase().includes(query);
        
        const matchesInterests = !interests.length || 
          interests.some(interest => spot.categories.includes(interest));
        
        const matchesDate = true; // Temporarily set to true until TouristSpot type is updated with availability
        
        return matchesSearch && matchesInterests && matchesDate;
      });
    }

    // Filtrar guias
    if (category === 'todos' || category === 'guias') {
      guides = mockGuides.filter(guide => {
        const matchesSearch = !query ||
          guide.name.toLowerCase().includes(query) ||
          guide.description.toLowerCase().includes(query) ||
          guide.specialties.some(s => s.toLowerCase().includes(query));
        
        const matchesInterests = !interests.length ||
          interests.some(interest => guide.specialties.includes(interest));
        
        const matchesDate = isAvailableInDateRange(guide.availability || [], dateRange);
        
        return matchesSearch && matchesInterests && matchesDate;
      });
    }

    // Filtrar restaurantes
    if (category === 'todos' || category === 'restaurantes') {
      restaurants = mockRestaurants.filter(restaurant => {
        const matchesSearch = !query ||
          restaurant.name.toLowerCase().includes(query) ||
          restaurant.description?.toLowerCase().includes(query) ||
          restaurant.cuisine.toLowerCase().includes(query);
        
        const matchesInterests = !interests.length ||
          interests.includes(restaurant.cuisine);
        
        const matchesDate = true; // Restaurants don't have availability property yet
        
        return matchesSearch && matchesInterests && matchesDate;
      });
    }

    // Filtrar roteiros
    if (category === 'todos' || category === 'roteiros') {
      itineraries = mockItineraries.filter(itinerary => {
        const matchesSearch = !query ||
          itinerary.title.toLowerCase().includes(query) ||
          itinerary.description.toLowerCase().includes(query) ||
          itinerary.guide?.name.toLowerCase().includes(query);
        
        const matchesInterests = !interests.length ||
          interests.some(interest => 
            itinerary.interests?.includes(interest) ||
            itinerary.spots.some(spot => spot.categories?.includes(interest))
          );
        
        const matchesDate = true; // TODO: Implement date filtering once availability is added to Itinerary type
        
        return matchesSearch && matchesInterests && matchesDate;
      });
    }

    return { spots, guides, restaurants, itineraries };
  }, [filters]);

  return results;
};