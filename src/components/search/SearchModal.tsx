import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import DateRangeFilter from './DateRangeFilter';
import CategoryFilter from '@/components/spots/CategoryFilter';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (filters: {
    searchTerm: string;
    category: string;
    dateRange: DateRange | undefined;
    interests: string[];
  }) => void;
}

const SearchModal = ({ isOpen, onClose, onSearch }: SearchModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const searchCategories = [
    { id: 'todos', name: 'Todos', icon: '🔍', count: 0 },
    { id: 'destinos', name: 'Destinos', icon: '🗺️', count: 0 },
    { id: 'guias', name: 'Guias', icon: '🧭', count: 0 },
    { id: 'restaurantes', name: 'Restaurantes', icon: '🍽️', count: 0 },
    { id: 'roteiros', name: 'Roteiros', icon: '📍', count: 0 },
  ];

  const availableInterests = [
    'natureza', 'aventura', 'cultura', 'historia', 'gastronomia',
    'trekking', 'rapel', 'pantanal', 'fauna', 'pesca'
  ];

  const handleSearch = () => {
    onSearch({
      searchTerm,
      category: activeCategory,
      dateRange,
      interests: selectedInterests
    });
    onClose();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setActiveCategory('todos');
    setDateRange(undefined);
    setSelectedInterests([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold gradient-text">Busca Avançada</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Campo de busca */}
          <div>
            <label className="block text-sm font-medium mb-2">O que você procura?</label>
            <Input
              placeholder="Digite sua busca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Filtros de categoria */}
          <div>
            <label className="block text-sm font-medium mb-2">Categoria</label>
            <CategoryFilter
              categories={searchCategories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
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

          {/* Filtro de interesses */}
          <div>
            <label className="block text-sm font-medium mb-2">Seus interesses</label>
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
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={clearFilters}>
            Limpar Filtros
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSearch} className="bg-cerrado-600 hover:bg-cerrado-700">
              Buscar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;