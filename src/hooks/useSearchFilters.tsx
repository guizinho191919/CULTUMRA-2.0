
import { useMemo } from 'react';
import { mockTouristSpots, mockGuides, mockEvents } from '@/data/mockData';

export const useSearchFilters = (searchTerm: string, activeCategory: string) => {
  const searchCategories = useMemo(() => [
    { id: 'todos', name: 'Todos', icon: '🔍', count: 0 },
    { id: 'destinos', name: 'Destinos', icon: '🗺️', count: mockTouristSpots.length },
    { id: 'guias', name: 'Guias', icon: '🧭', count: mockGuides.length },
    { id: 'eventos', name: 'Eventos', icon: '🎉', count: mockEvents.length },
  ], []);

  const filteredResults = useMemo(() => {
    const query = searchTerm.toLowerCase();
    
    if (activeCategory === 'todos' || activeCategory === 'destinos') {
      const spots = mockTouristSpots.filter(spot => 
        spot.name.toLowerCase().includes(query) ||
        spot.description.toLowerCase().includes(query) ||
        spot.location.city.toLowerCase().includes(query) ||
        spot.categories.some(cat => cat.toLowerCase().includes(query))
      );
      return { spots, guides: [], events: [] };
    }
    
    if (activeCategory === 'guias') {
      const guides = mockGuides.filter(guide =>
        guide.name.toLowerCase().includes(query) ||
        guide.description.toLowerCase().includes(query) ||
        guide.specialties.some(s => s.toLowerCase().includes(query))
      );
      return { spots: [], guides, events: [] };
    }
    
    if (activeCategory === 'eventos') {
      const events = mockEvents.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.address.toLowerCase().includes(query)
      );
      return { spots: [], guides: [], events };
    }

    return { spots: [], guides: [], events: [] };
  }, [searchTerm, activeCategory]);

  return {
    searchCategories,
    filteredResults
  };
};
