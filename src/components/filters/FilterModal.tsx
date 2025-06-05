import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { X } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: any;
  onFiltersChange: (filters: any) => void;
}

const FilterModal = ({ isOpen, onClose, filters, onFiltersChange }: FilterModalProps) => {
  const [localFilters, setLocalFilters] = useState(filters);

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

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      sortBy: 'relevancia',
      categories: [],
      weekdays: [],
      duration: { min: 0, max: 16 }
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Filtros</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Ordenar Por */}
          <div>
            <h3 className="font-medium mb-3 text-gray-600">ORDENAR POR</h3>
            <RadioGroup 
              value={localFilters.sortBy} 
              onValueChange={(value) => setLocalFilters({...localFilters, sortBy: value})}
              className="grid grid-cols-2 gap-4"
            >
              {sortOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Categorias */}
          <div>
            <h3 className="font-medium mb-3 text-gray-600">CATEGORIAS</h3>
            <div className="grid grid-cols-2 gap-4">
              {categoryOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={option.id}
                    checked={localFilters.categories.includes(option.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setLocalFilters({
                          ...localFilters,
                          categories: [...localFilters.categories, option.id]
                        });
                      } else {
                        setLocalFilters({
                          ...localFilters,
                          categories: localFilters.categories.filter((c: string) => c !== option.id)
                        });
                      }
                    }}
                  />
                  <Label htmlFor={option.id}>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Dias da Semana */}
          <div>
            <h3 className="font-medium mb-3 text-gray-600">DIAS DA SEMANA</h3>
            <div className="grid grid-cols-3 gap-4">
              {weekdayOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={option.id}
                    checked={localFilters.weekdays.includes(option.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setLocalFilters({
                          ...localFilters,
                          weekdays: [...localFilters.weekdays, option.id]
                        });
                      } else {
                        setLocalFilters({
                          ...localFilters,
                          weekdays: localFilters.weekdays.filter((w: string) => w !== option.id)
                        });
                      }
                    }}
                  />
                  <Label htmlFor={option.id}>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Duração */}
          <div>
            <h3 className="font-medium mb-3 text-gray-600">FILTRAR POR TEMPO DE DURAÇÃO</h3>
            <div className="px-4">
              <Slider
                value={[localFilters.duration.min, localFilters.duration.max]}
                onValueChange={([min, max]) => {
                  setLocalFilters({
                    ...localFilters,
                    duration: { min, max }
                  });
                }}
                max={16}
                min={0}
                step={1}
                className="mb-4"
              />
              <p className="text-sm text-gray-600">
                Mostrar atividades que duram de {localFilters.duration.min}h a {localFilters.duration.max}h.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClearFilters} className="flex-1">
            LIMPAR FILTROS
          </Button>
          <Button onClick={handleApplyFilters} className="flex-1 bg-orange-600 hover:bg-orange-700">
            VER RESULTADOS
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;