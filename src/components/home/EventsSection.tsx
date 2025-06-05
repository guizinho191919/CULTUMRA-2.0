
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import EventCard from '@/components/events/EventCard';
import { Event } from '@/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface EventsSectionProps {
  events: Event[];
  onViewEvent: (event: Event) => void;
}

const EventsSection = ({ events, onViewEvent }: EventsSectionProps) => {
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

  return (
    <section className="space-y-6">
      <div className="flex items-center">
        <h2 className="text-3xl font-bold gradient-text">🎉 Eventos em Destaque</h2>
      </div>
      
      <div className="relative px-4 sm:px-8 md:px-12">
        <Carousel
          opts={carouselOpts}
          className="w-full events-carousel"
        >
          <CarouselContent className="-ml-1 sm:-ml-2 md:-ml-4">
            {events.map((event) => (
              <CarouselItem key={event.id} className="pl-1 sm:pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <div className="h-full">
                  <EventCard
                    key={event.id}
                    event={event}
                    onViewDetails={onViewEvent}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-3 sm:-left-7 md:-left-12" />
          <CarouselNext className="-right-3 sm:-right-7 md:-right-12" />
        </Carousel>
      </div>
      <div className="flex justify-center mt-6">
        <Button variant="outline" onClick={() => navigate('/events')}>Agenda Completa</Button>
      </div>
    </section>
  );
};

export default EventsSection;
