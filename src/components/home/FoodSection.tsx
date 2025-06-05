
import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CategoryFilter from '@/components/spots/CategoryFilter';
import FoodRestaurantCard from './FoodRestaurantCard';
import { mockRestaurants, cuisineCategories } from '@/data/mockRestaurants';

const FoodSection = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('todas');

  // Memoizar a filtragem para evitar recálculos desnecessários
  const filteredRestaurants = useMemo(() => {
    return activeCategory === 'todas' 
      ? mockRestaurants 
      : mockRestaurants.filter(restaurant => restaurant.cuisine === activeCategory);
  }, [activeCategory]);

  // Memoizar o callback de mudança de categoria
  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category);
  }, []);

  // Memoizar as opções do carrossel
  const carouselOpts = useMemo(() => ({
    align: "start" as const,
    loop: false,
    skipSnaps: false,     // Reduzir para melhor performance
    dragFree: false,      // Desabilitar para reduzir cálculos
    containScroll: "trimSnaps" as const,
    duration: 25,         // Aumentar um pouco a duração
    startIndex: 0
  }), []);

  return (
    <section className="space-y-6">
      <div className="flex items-center">
        <h2 className="text-3xl font-bold gradient-text">🍽️ Explore Comidas</h2>
      </div>

      <div className="mb-6">
        <CategoryFilter
          categories={cuisineCategories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>
      
      <div className="relative px-8 md:px-12">
        <Carousel
          opts={carouselOpts}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {filteredRestaurants.map((restaurant) => (
              <CarouselItem key={restaurant.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="h-full">
                  <FoodRestaurantCard restaurant={restaurant} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-7 md:-left-12" />
          <CarouselNext className="-right-7 md:-right-12" />
        </Carousel>
      </div>
      <div className="flex justify-center mt-6">
        <Button variant="outline" onClick={() => navigate('/explore-food')}>Ver Todos</Button>
      </div>
    </section>
  );
};

export default FoodSection;
