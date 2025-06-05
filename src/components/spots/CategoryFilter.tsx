
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useEffect } from 'react';

interface CategoryFilterProps {
  categories: Array<{
    id: string;
    name: string;
    icon: string;
    count: number;
  }>;
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

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

  // Efeito para garantir que a categoria ativa esteja visível
  useEffect(() => {
    if (scrollRef.current) {
      const activeButton = scrollRef.current.querySelector(`[data-category="${activeCategory}"]`);
      if (activeButton) {
        const containerRect = scrollRef.current.getBoundingClientRect();
        const buttonRect = activeButton.getBoundingClientRect();
        
        // Verifica se o botão está fora da área visível
        if (buttonRect.left < containerRect.left || buttonRect.right > containerRect.right) {
          activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }
    }
  }, [activeCategory]);

  return (
    <div className="flex items-center gap-2 w-full relative">
      {/* Botão de seta esquerda */}
      <Button
        variant="ghost"
        size="icon"
        onClick={scrollLeft}
        className="bg-cerrado-500 hover:bg-cerrado-600 h-8 w-8 rounded-full shadow-lg flex-shrink-0 absolute left-0 z-10"
      >
        <ChevronLeft className="h-4 w-4 text-white" />
      </Button>

      {/* Container dos filtros com padding para os botões */}
      <div 
        ref={scrollRef}
        className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide w-full px-10"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => (
          <Button
            key={category.id}
            data-category={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            className={`flex items-center space-x-2 whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
              activeCategory === category.id
                ? 'bg-cerrado-600 hover:bg-cerrado-700 text-white'
                : 'hover:bg-cerrado-50 hover:text-cerrado-700 hover:border-cerrado-300'
            }`}
          >
            <span>{category.icon}</span>
            <span className="text-sm">{category.name}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              activeCategory === category.id ? 'bg-white/20' : 'bg-gray-100'
            }`}>
              {category.count}
            </span>
          </Button>
        ))}
      </div>

      {/* Botão de seta direita */}
      <Button
        variant="ghost"
        size="icon"
        onClick={scrollRight}
        className="bg-cerrado-500 hover:bg-cerrado-600 h-8 w-8 rounded-full shadow-lg flex-shrink-0 absolute right-0 z-10"
      >
        <ChevronRight className="h-4 w-4 text-white" />
      </Button>
    </div>
  );
};

export default CategoryFilter;
