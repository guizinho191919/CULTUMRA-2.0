
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import ItineraryCard from '@/components/itinerary/ItineraryCard';
import { Itinerary } from '@/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ItinerariesSectionProps {
  itineraries: Itinerary[];
  onViewItinerary: (itinerary: Itinerary) => void;
}

const ItinerariesSection = ({ itineraries, onViewItinerary }: ItinerariesSectionProps) => {
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

  // Embaralhar os roteiros para exibição aleatória
  const randomizedItineraries = useMemo(() => {
    // Cria uma cópia do array para não modificar o original
    return [...itineraries].sort(() => Math.random() - 0.5);
  }, [itineraries]);

  return (
    <section className="space-y-6">
      <div className="flex items-center">
        <h2 className="text-3xl font-bold gradient-text">📍 Roteiros Recomendados</h2>
      </div>
      
      <div className="relative px-8 md:px-12">
        <Carousel
          opts={carouselOpts}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {randomizedItineraries.map((itinerary) => (
              <CarouselItem key={itinerary.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="h-full">
                  <ItineraryCard
                    itinerary={itinerary}
                    onViewDetails={onViewItinerary}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-7 md:-left-12" />
          <CarouselNext className="-right-7 md:-right-12" />
        </Carousel>
      </div>
      
      <div className="flex justify-center mt-6">
        <Button variant="outline" onClick={() => navigate('/itineraries')}>Ver Todos</Button>
      </div>
    </section>
  );
};

export default ItinerariesSection;
