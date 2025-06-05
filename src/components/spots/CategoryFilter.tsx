
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

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

  return (
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
        {categories.map((category) => (
          <Button
            key={category.id}
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
        className="bg-cerrado-500 hover:bg-cerrado-600 h-8 w-8 rounded-full shadow-lg flex-shrink-0 md:hidden"
      >
        <ChevronRight className="h-4 w-4 text-white" />
      </Button>
    </div>
  );
};

export default CategoryFilter;
