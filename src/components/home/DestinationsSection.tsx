import React, { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import TouristSpotCard from '@/components/spots/TouristSpotCard';
import CategoryFilter from '@/components/spots/CategoryFilter';
import { TouristSpot } from '@/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface DestinationsSectionProps {
  categories: any[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  filteredSpots: TouristSpot[];
  onViewSpotDetails: (spot: TouristSpot) => void;
}

const DestinationsSection = React.memo(({
  categories,
  activeCategory,
  onCategoryChange,
  filteredSpots,
  onViewSpotDetails
}: DestinationsSectionProps) => {
  const navigate = useNavigate();

  // Memoizar opções do carrossel
  const carouselOpts = useMemo(() => ({
    align: "start" as const,
    loop: false,
    skipSnaps: false,
    dragFree: false,
    containScroll: "trimSnaps" as const,
    duration: 25,
    startIndex: 0
  }), []);

  // Memoizar callback de navegação
  const handleNavigateToExplore = useCallback(() => {
    navigate('/explore');
  }, [navigate]);

  return (
    <section className="space-y-6">
      <div className="flex items-center">
        <h2 className="text-3xl font-bold gradient-text">🗺️ Explore Destinos</h2>
      </div>
      <div className="mb-6">
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={onCategoryChange}
        />
      </div>
      <div className="relative px-8 md:px-12">
        <Carousel
          opts={carouselOpts}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {filteredSpots.map((spot) => (
              <CarouselItem key={spot.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="h-full">
                  <TouristSpotCard spot={spot} onViewDetails={onViewSpotDetails} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-7 md:-left-12" />
          <CarouselNext className="-right-7 md:-right-12" />
        </Carousel>
      </div>
      <div className="flex justify-center mt-6">
        <Button variant="outline" onClick={handleNavigateToExplore}>Ver Todos</Button>
      </div>
    </section>
  );
});

DestinationsSection.displayName = 'DestinationsSection';

export default DestinationsSection;
