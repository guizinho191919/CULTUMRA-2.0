
import { Button } from '@/components/ui/button';

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
  return (
    <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={activeCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.id)}
          className={`flex items-center space-x-2 whitespace-nowrap transition-all duration-200 ${
            activeCategory === category.id
              ? 'bg-cerrado-600 hover:bg-cerrado-700 text-white'
              : 'hover:bg-cerrado-50 hover:text-cerrado-700 hover:border-cerrado-300'
          }`}
        >
          <span>{category.icon}</span>
          <span>{category.name}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            activeCategory === category.id ? 'bg-white/20' : 'bg-gray-100'
          }`}>
            {category.count}
          </span>
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
