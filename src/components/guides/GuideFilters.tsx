import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Filter, SortAsc } from 'lucide-react';
import { mockGuides } from '@/data/mockData';

interface GuideFiltersProps {
  activeFilter: string;
  sortBy: string;
  onFilterChange: (filterId: string) => void;
  onSortChange: (sortId: string) => void;
  filteredCount: number;
}

const GuideFilters = ({ 
  activeFilter, 
  sortBy, 
  onFilterChange, 
  onSortChange, 
  filteredCount 
}: GuideFiltersProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showSortOptions, setShowSortOptions] = useState(false);

  // Filtros baseados nas especialidades dos guias do projeto
  const filters = [
    { 
      id: 'todos', 
      name: 'Todos', 
      icon: '🧭', 
      count: mockGuides.length,
      color: 'text-cerrado-600'
    },
    { 
      id: 'pantanal', 
      name: 'Pantanal', 
      icon: '🐊', 
      count: mockGuides.filter(g => g.specialties.some(s => s.toLowerCase().includes('pantanal'))).length,
      color: 'text-pantanal-600'
    },
    { 
      id: 'observacao', 
      name: 'Fauna', 
      icon: '🦎', 
      count: mockGuides.filter(g => g.specialties.some(s => s.toLowerCase().includes('fauna') || s.toLowerCase().includes('observação'))).length,
      color: 'text-green-600'
    },
    { 
      id: 'pesca', 
      name: 'Pesca', 
      icon: '🎣', 
      count: mockGuides.filter(g => g.specialties.some(s => s.toLowerCase().includes('pesca'))).length,
      color: 'text-blue-600'
    },
    { 
      id: 'aventura', 
      name: 'Aventura', 
      icon: '🏃‍♂️', 
      count: mockGuides.filter(g => g.specialties.some(s => s.toLowerCase().includes('aventura') || s.toLowerCase().includes('trilha'))).length,
      color: 'text-orange-600'
    },
    { 
      id: 'cultura', 
      name: 'Cultura', 
      icon: '🎭', 
      count: mockGuides.filter(g => g.specialties.some(s => s.toLowerCase().includes('cultura') || s.toLowerCase().includes('história'))).length,
      color: 'text-purple-600'
    }
  ];

  const sortOptions = [
    { id: 'rating', name: 'Melhor Avaliação', icon: '⭐' },
    { id: 'price', name: 'Menor Preço', icon: '💰' },
    { id: 'experience', name: 'Mais Experiente', icon: '🎯' },
    { id: 'reviews', name: 'Mais Avaliações', icon: '📝' }
  ];

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const getCurrentSortOption = () => {
    return sortOptions.find(option => option.id === sortBy) || sortOptions[0];
  };

  return (
    <div className="space-y-4">
      {/* Filtros por Categoria - Inspirado no CategoryFilter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Filter className="h-5 w-5 text-cerrado-600" />
            Filtrar por Especialidade
          </h3>
          <div className="text-sm text-gray-600">
            {filteredCount} guia{filteredCount !== 1 ? 's' : ''} encontrado{filteredCount !== 1 ? 's' : ''}
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full">
          {/* Botão de seta esquerda */}
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollLeft}
            className="bg-cerrado-500 hover:bg-cerrado-600 h-8 w-8 rounded-full shadow-lg flex-shrink-0 md:hidden"
          >
            <ChevronLeft className="h-4 w-4 text-white" />
          </Button>

          {/* Container dos filtros */}
          <div 
            ref={scrollRef}
            className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide flex-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filters.map((filter) => (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => onFilterChange(filter.id)}
                className={`flex items-center space-x-2 whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                  activeFilter === filter.id
                    ? 'bg-cerrado-600 hover:bg-cerrado-700 text-white shadow-lg'
                    : 'hover:bg-cerrado-50 hover:text-cerrado-700 hover:border-cerrado-300 bg-white'
                }`}
              >
                <span className="text-base">{filter.icon}</span>
                <span className="text-sm font-medium">{filter.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                  activeFilter === filter.id 
                    ? 'bg-white/20 text-white' 
                    : `bg-gray-100 ${filter.color}`
                }`}>
                  {filter.count}
                </span>
              </Button>
            ))}
          </div>

          {/* Botão de seta direita */}
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollRight}
            className="bg-cerrado-500 hover:bg-cerrado-600 h-8 w-8 rounded-full shadow-lg flex-shrink-0 md:hidden"
          >
            <ChevronRight className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>

      {/* Ordenação */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2">
          <SortAsc className="h-5 w-5 text-cerrado-600" />
          <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
        </div>
        
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSortOptions(!showSortOptions)}
            className="flex items-center gap-2 min-w-[160px] justify-between hover:bg-cerrado-50 hover:border-cerrado-300"
          >
            <span className="flex items-center gap-2">
              <span>{getCurrentSortOption().icon}</span>
              <span className="text-sm">{getCurrentSortOption().name}</span>
            </span>
            <ChevronRight className={`h-4 w-4 transition-transform ${
              showSortOptions ? 'rotate-90' : ''
            }`} />
          </Button>
          
          {showSortOptions && (
            <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[160px]">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    onSortChange(option.id);
                    setShowSortOptions(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-cerrado-50 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                    sortBy === option.id ? 'bg-cerrado-100 text-cerrado-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  <span>{option.icon}</span>
                  <span>{option.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuideFilters;