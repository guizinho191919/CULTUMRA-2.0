
import TouristSpotCard from '@/components/spots/TouristSpotCard';
import GuideCard from '@/components/guides/GuideCard';
import EventCard from '@/components/events/EventCard';
import { TouristSpot, Guide, Event } from '@/types';

interface SearchResultsProps {
  results: {
    spots: TouristSpot[];
    guides: Guide[];
    events: Event[];
  };
  searchTerm: string;
  onViewSpotDetails: (spot: TouristSpot) => void;
  onViewGuideProfile: (guide: Guide) => void;
  onStartChat: (guide: Guide) => void;
  onViewEvent: (event: Event) => void;
}

const SearchResults = ({
  results,
  searchTerm,
  onViewSpotDetails,
  onViewGuideProfile,
  onStartChat,
  onViewEvent
}: SearchResultsProps) => {
  const totalResults = results.spots.length + results.guides.length + results.events.length;

  return (
    <>
      {/* Results Count */}
      {searchTerm && (
        <div className="mb-4">
          <p className="text-gray-600">
            {totalResults} resultado{totalResults !== 1 ? 's' : ''} encontrado{totalResults !== 1 ? 's' : ''} para "{searchTerm}"
          </p>
        </div>
      )}

      {/* Tourist Spots Results */}
      {results.spots.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">🗺️</span>
            Destinos ({results.spots.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.spots.map((spot) => (
              <TouristSpotCard
                key={spot.id}
                spot={spot}
                onViewDetails={onViewSpotDetails}
              />
            ))}
          </div>
        </div>
      )}

      {/* Guides Results */}
      {results.guides.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">🧭</span>
            Guias ({results.guides.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {results.guides.map((guide) => (
              <GuideCard
                key={guide.id}
                guide={guide}
                onViewProfile={onViewGuideProfile}
                onStartChat={onStartChat}
              />
            ))}
          </div>
        </div>
      )}

      {/* Events Results */}
      {results.events.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">🎉</span>
            Eventos ({results.events.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onViewDetails={onViewEvent}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default SearchResults;
