import { DateRange } from 'react-day-picker';
import TouristSpotCard from '@/components/spots/TouristSpotCard';
import GuideCard from '@/components/guides/GuideCard';
import RestaurantCard from '@/components/restaurants/RestaurantCard';
import ItineraryCard from '@/components/itinerary/ItineraryCard';

interface AdvancedSearchResultsProps {
  results: {
    spots: any[];
    guides: any[];
    restaurants: any[];
    itineraries: any[];
  };
  dateRange?: DateRange;
  onViewDetails: (type: string, id: string) => void;
}

const AdvancedSearchResults = ({ results, dateRange, onViewDetails }: AdvancedSearchResultsProps) => {
  const totalResults = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);

  if (totalResults === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold mb-2">Nenhum resultado encontrado</h3>
        <p className="text-gray-600">Tente ajustar seus filtros ou termo de busca</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Destinos */}
      {results.spots.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Destinos ({results.spots.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.spots.map(spot => (
              <TouristSpotCard
                key={spot.id}
                spot={spot}
                onViewDetails={() => onViewDetails('spot', spot.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Guias */}
      {results.guides.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Guias ({results.guides.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.guides.map(guide => (
              <GuideCard
                key={guide.id}
                guide={guide}
                onViewProfile={() => onViewDetails('guide', guide.id)}
                onStartChat={() => onViewDetails('chat', guide.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Restaurantes */}
      {results.restaurants.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Restaurantes ({results.restaurants.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.restaurants.map(restaurant => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onViewDetails={() => onViewDetails('restaurant', restaurant.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Roteiros */}
      {results.itineraries.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Roteiros ({results.itineraries.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.itineraries.map(itinerary => (
              <ItineraryCard
                key={itinerary.id}
                itinerary={itinerary}
                onViewDetails={() => onViewDetails('itinerary', itinerary.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default AdvancedSearchResults;