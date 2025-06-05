import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Filter, ChevronDown } from 'lucide-react';
import FilterModal from './FilterModal';

interface FilterBarProps {
  onFiltersChange: (filters: any) => void;
}

const FilterBar = ({ onFiltersChange }: FilterBarProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    sortBy: 'relevancia',
    categories: [],
    weekdays: [],
    duration: { min: 0, max: 16 }
  });

  const sortOptions = [
    { id: 'relevancia', label: 'Relevância' },
    { id: 'avaliacao', label: 'Avaliação' },
    { id: 'preco', label: 'Preço' },
    { id: 'popularidade', label: 'Popularidade' }
  ];

  const categoryOptions = [
    { id: 'ingressos', label: 'Ingressos' },
    { id: 'passeios-um-dia', label: 'Passeios de um dia' },
    { id: 'passeios-mais-um-dia', label: 'Passeios mais de um dia' },
    { id: 'passeios-guiados', label: 'Passeios guiados' },
    { id: 'passeios-privativos', label: 'Passeios privativos' },
    { id: 'gastronomia', label: 'Gastronomia' },
    { id: 'aventura-natureza', label: 'Aventura e Natureza' },
    { id: 'atividades-agua', label: 'Atividades na água' }
  ];

  const weekdayOptions = [
    { id: 'seg', label: 'Seg' },
    { id: 'ter', label: 'Ter' },
    { id: 'qua', label: 'Qua' },
    { id: 'qui', label: 'Qui' },
    { id: 'sex', label: 'Sex' },
    { id: 'sab', label: 'Sáb' },
    { id: 'dom', label: 'Dom' }
  ];

  const handleSortChange = (value: string) => {
    const newFilters = { ...activeFilters, sortBy: value };
    setActiveFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked 
      ? [...activeFilters.categories, categoryId]
      : activeFilters.categories.filter((c: string) => c !== categoryId);
    const newFilters = { ...activeFilters, categories: newCategories };
    setActiveFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleWeekdayChange = (weekdayId: string, checked: boolean) => {
    const newWeekdays = checked 
      ? [...activeFilters.weekdays, weekdayId]
      : activeFilters.weekdays.filter((w: string) => w !== weekdayId);
    const newFilters = { ...activeFilters, weekdays: newWeekdays };
    setActiveFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDurationChange = ([min, max]: number[]) => {
    const newFilters = { ...activeFilters, duration: { min, max } };
    setActiveFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      sortBy: 'relevancia',
      categories: [],
      weekdays: [],
      duration: { min: 0, max: 16 }
    };
    setActiveFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const applyFilters = () => {
    onFiltersChange(activeFilters);
  };

  return (
    <>
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 whitespace-nowrap"
          onClick={() => setShowFilters(true)}
        >
          <Filter className="w-4 h-4" />
          Filtros
        </Button>
        
        {/* Dropdown Ordenar */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
              Ordenar
              <ChevronDown className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-600">ORDENAR POR</h3>
              <RadioGroup 
                value={activeFilters.sortBy} 
                onValueChange={handleSortChange}
                className="grid grid-cols-2 gap-4"
              >
                {sortOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" onClick={clearFilters} className="flex-1">
                  LIMPAR FILTROS
                </Button>
                <Button onClick={applyFilters} className="flex-1 bg-orange-600 hover:bg-orange-700">
                  VER RESULTADOS
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Dropdown Categorias */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
              Categorias
              <ChevronDown className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-600">CATEGORIAS</h3>
              <div className="grid grid-cols-2 gap-4">
                {categoryOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={option.id}
                      checked={activeFilters.categories.includes(option.id)}
                      onCheckedChange={(checked) => handleCategoryChange(option.id, !!checked)}
                    />
                    <Label htmlFor={option.id}>{option.label}</Label>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" onClick={clearFilters} className="flex-1">
                  LIMPAR FILTROS
                </Button>
                <Button onClick={applyFilters} className="flex-1 bg-orange-600 hover:bg-orange-700">
                  VER RESULTADOS
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Dropdown Dias da semana */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
              Dias da semana
              <ChevronDown className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-600">DIAS DA SEMANA</h3>
              <div className="grid grid-cols-3 gap-4">
                {weekdayOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={option.id}
                      checked={activeFilters.weekdays.includes(option.id)}
                      onCheckedChange={(checked) => handleWeekdayChange(option.id, !!checked)}
                    />
                    <Label htmlFor={option.id}>{option.label}</Label>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" onClick={clearFilters} className="flex-1">
                  LIMPAR FILTROS
                </Button>
                <Button onClick={applyFilters} className="flex-1 bg-orange-600 hover:bg-orange-700">
                  VER RESULTADOS
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Dropdown Duração da atividade */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
              Duração da atividade
              <ChevronDown className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-600">FILTRAR POR TEMPO DE DURAÇÃO</h3>
              <div className="px-4">
                <Slider
                  value={[activeFilters.duration.min, activeFilters.duration.max]}
                  onValueChange={handleDurationChange}
                  max={16}
                  min={0}
                  step={1}
                  className="mb-4"
                />
                <p className="text-sm text-gray-600">
                  Mostrar atividades que duram de {activeFilters.duration.min}h a {activeFilters.duration.max}h.
                </p>
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" onClick={clearFilters} className="flex-1">
                  LIMPAR FILTROS
                </Button>
                <Button onClick={applyFilters} className="flex-1 bg-orange-600 hover:bg-orange-700">
                  VER RESULTADOS
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <FilterModal 
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={activeFilters}
        onFiltersChange={(filters) => {
          setActiveFilters(filters);
          onFiltersChange(filters);
        }}
      />
    </>
  );
};

export default FilterBar;