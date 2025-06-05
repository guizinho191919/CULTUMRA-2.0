
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import CategoryFilter from '@/components/spots/CategoryFilter';
import SearchForm from '@/components/search/SearchForm';
import SearchResults from '@/components/search/SearchResults';
import EmptySearchState from '@/components/search/EmptySearchState';
import { useSearchFilters } from '@/hooks/useSearchFilters';
import { TouristSpot, Guide, Event } from '@/types';

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Get search query from URL
  const urlParams = new URLSearchParams(location.search);
  const queryFromUrl = urlParams.get('q') || '';

  useState(() => {
    if (queryFromUrl) {
      setSearchTerm(queryFromUrl);
    }
  });

  const { searchCategories, filteredResults } = useSearchFilters(searchTerm, activeCategory);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleViewSpotDetails = (spot: TouristSpot) => {
    navigate(`/spot/${spot.id}`);
  };

  const handleViewGuideProfile = (guide: Guide) => {
    navigate(`/guide/${guide.id}`);
  };

  const handleStartChat = (guide: Guide) => {
    navigate(`/chat/${guide.id}`);
  };

  const handleViewEvent = (event: Event) => {
    navigate(`/event/${event.id}`);
  };

  const totalResults = filteredResults.spots.length + filteredResults.guides.length + filteredResults.events.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold gradient-text mb-2">Buscar</h1>
          <p className="text-gray-600">Encontre destinos, guias e eventos em Mato Grosso</p>
        </div>

        <SearchForm
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSubmit={handleSearch}
        />

        <div className="mb-6">
          <CategoryFilter
            categories={searchCategories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        <SearchResults
          results={filteredResults}
          searchTerm={searchTerm}
          onViewSpotDetails={handleViewSpotDetails}
          onViewGuideProfile={handleViewGuideProfile}
          onStartChat={handleStartChat}
          onViewEvent={handleViewEvent}
        />

        <EmptySearchState
          searchTerm={searchTerm}
          totalResults={totalResults}
          onExplore={() => navigate('/explore')}
        />
      </main>

      <Navigation />
    </div>
  );
};

export default Search;
