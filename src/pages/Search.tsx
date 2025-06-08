
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DateRange } from 'react-day-picker';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import CategoryFilter from '@/components/spots/CategoryFilter';
import DateRangeFilter from '@/components/search/DateRangeFilter';
import AdvancedSearchResults from '@/components/search/AdvancedSearchResults';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// Remove the Checkbox import as it doesn't exist
// import { Checkbox } from '@/components/ui/checkbox';
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch';
import { TouristSpot, Guide, Event } from '@/types';

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Categorias expandidas
  const searchCategories = [
    { id: 'todos', name: 'Todos', icon: '🔍', count: 0 },
    { id: 'destinos', name: 'Destinos', icon: '🗺️', count: 0 },
    { id: 'guias', name: 'Guias', icon: '🧭', count: 0 },
    { id: 'restaurantes', name: 'Restaurantes', icon: '🍽️', count: 0 },
    { id: 'roteiros', name: 'Roteiros', icon: '📍', count: 0 },
  ];

  // Interesses/categorias disponíveis
  const availableInterests = [
    'natureza', 'aventura', 'cultura', 'historia', 'gastronomia',
    'trekking', 'rapel', 'pantanal', 'fauna', 'pesca'
  ];

  const searchFilters = {
    searchTerm,
    category: activeCategory,
    dateRange,
    interests: selectedInterests
  };

  const results = useAdvancedSearch(searchFilters);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold gradient-text mb-2">Busca Avançada</h1>
          <p className="text-gray-600">Encontre exatamente o que procura para sua viagem</p>
        </div>

        {/* Formulário de busca expandido */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Campo de busca */}
            <div>
              <label className="block text-sm font-medium mb-2">O que você procura?</label>
              <Input
                placeholder="Digite sua busca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Seletor de período */}
            <div>
              <label className="block text-sm font-medium mb-2">Período da viagem</label>
              <DateRangeFilter
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
            </div>

            {/* Filtro de interesses - Using native HTML checkboxes instead */}
            <div>
              <label className="block text-sm font-medium mb-2">Seus interesses</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    {selectedInterests.length > 0 
                      ? `${selectedInterests.length} selecionados`
                      : "Selecionar interesses"
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid grid-cols-2 gap-2">
                    {availableInterests.map(interest => (
                      <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-cerrado-600 focus:ring-cerrado-500"
                          checked={selectedInterests.includes(interest)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedInterests([...selectedInterests, interest]);
                            } else {
                              setSelectedInterests(selectedInterests.filter(i => i !== interest));
                            }
                          }}
                        />
                        <span className="text-sm capitalize">{interest}</span>
                      </label>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Filtros de categoria */}
        <CategoryFilter
          categories={searchCategories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Resultados */}
        <AdvancedSearchResults
          results={results}
          dateRange={dateRange}
          onViewDetails={(type, id) => navigate(`/${type}/${id}`)}
        />
      </main>

      <Navigation />
    </div>
  );
};

export default Search;
