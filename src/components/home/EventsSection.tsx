
import { useNavigate } from 'react-router-dom';
import { useMemo, useState, useRef } from 'react';
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
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface EventsSectionProps {
  events: Event[];
  onViewEvent: (event: Event) => void;
}

const EventsSection = ({ events, onViewEvent }: EventsSectionProps) => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('todos');
  const [activeDateFilter, setActiveDateFilter] = useState('todos');
  const scrollRef = useRef<HTMLDivElement>(null);
  const dateScrollRef = useRef<HTMLDivElement>(null);

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

  // Categorias de eventos com contadores
  const categories = useMemo(() => {
    return [
      { id: 'todos', name: 'Todos', icon: '🎉', count: events.length },
      { id: 'festival', name: 'Festivais', icon: '🎭', count: events.filter(e => e.category === 'festival').length },
      { id: 'cultural', name: 'Cultural', icon: '🏛️', count: events.filter(e => e.category === 'cultural').length },
      { id: 'esportivo', name: 'Esportivo', icon: '🏆', count: events.filter(e => e.category === 'esportivo').length },
      { id: 'gastronomico', name: 'Gastronômico', icon: '🍽️', count: events.filter(e => e.category === 'gastronomico').length }
    ];
  }, [events]);

  // Filtros de data com contadores
  const dateFilters = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    
    return [
      { id: 'todos', name: 'Todos períodos', icon: '📅', count: events.length },
      { id: 'hoje', name: 'Hoje', icon: '📌', count: events.filter(e => {
        const eventDate = new Date(e.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate.getTime() === today.getTime();
      }).length },
      { id: 'semana', name: 'Esta semana', icon: '🗓️', count: events.filter(e => {
        const eventDate = new Date(e.date);
        return eventDate >= today && eventDate < nextWeek;
      }).length },
      { id: 'mes', name: 'Este mês', icon: '📆', count: events.filter(e => {
        const eventDate = new Date(e.date);
        return eventDate >= today && eventDate < nextMonth;
      }).length },
      { id: 'proximos', name: 'Próximos eventos', icon: '⏩', count: events.filter(e => {
        const eventDate = new Date(e.date);
        return eventDate >= today;
      }).length }
    ];
  }, [events]);

  // Filtrar eventos com base na categoria e data selecionadas
  const filteredEvents = useMemo(() => {
    let filtered = events;
    
    // Filtrar por categoria
    if (activeFilter !== 'todos') {
      filtered = filtered.filter(event => event.category === activeFilter);
    }
    
    // Filtrar por data
    if (activeDateFilter !== 'todos') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);
      
      if (activeDateFilter === 'hoje') {
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate.getTime() === today.getTime();
        });
      } else if (activeDateFilter === 'semana') {
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= today && eventDate < nextWeek;
        });
      } else if (activeDateFilter === 'mes') {
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= today && eventDate < nextMonth;
        });
      } else if (activeDateFilter === 'proximos') {
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= today;
        });
      }
    }
    
    return filtered;
  }, [events, activeFilter, activeDateFilter]);

  const scrollLeft = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center">
        <h2 className="text-3xl font-bold gradient-text">🎉 Eventos em Destaque</h2>
      </div>
      
      {/* Filtro por categoria */}
      <div className="flex items-center gap-2 w-full relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scrollLeft(scrollRef)}
          className="bg-cerrado-500 hover:bg-cerrado-600 h-8 w-8 rounded-full shadow-lg flex-shrink-0 absolute left-0 z-10"
        >
          <ChevronLeft className="h-4 w-4 text-white" />
        </Button>

        <div 
          ref={scrollRef}
          className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide w-full px-10"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeFilter === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(category.id)}
              className={`flex items-center space-x-2 whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                activeFilter === category.id
                  ? 'bg-cerrado-600 hover:bg-cerrado-700 text-white'
                  : 'hover:bg-cerrado-50 hover:text-cerrado-700 hover:border-cerrado-300'
              }`}
            >
              <span>{category.icon}</span>
              <span className="text-sm">{category.name}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                activeFilter === category.id ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {category.count}
              </span>
            </Button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => scrollRight(scrollRef)}
          className="bg-cerrado-500 hover:bg-cerrado-600 h-8 w-8 rounded-full shadow-lg flex-shrink-0 absolute right-0 z-10"
        >
          <ChevronRight className="h-4 w-4 text-white" />
        </Button>
      </div>
      
      {/* Filtro por data */}
      <div className="flex items-center gap-2 w-full relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scrollLeft(dateScrollRef)}
          className="bg-cerrado-500 hover:bg-cerrado-600 h-8 w-8 rounded-full shadow-lg flex-shrink-0 absolute left-0 z-10"
        >
          <ChevronLeft className="h-4 w-4 text-white" />
        </Button>

        <div 
          ref={dateScrollRef}
          className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide w-full px-10"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {dateFilters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeDateFilter === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveDateFilter(filter.id)}
              className={`flex items-center space-x-2 whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                activeDateFilter === filter.id
                  ? 'bg-cerrado-600 hover:bg-cerrado-700 text-white'
                  : 'hover:bg-cerrado-50 hover:text-cerrado-700 hover:border-cerrado-300'
              }`}
            >
              <span>{filter.icon}</span>
              <span className="text-sm">{filter.name}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                activeDateFilter === filter.id ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {filter.count}
              </span>
            </Button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => scrollRight(dateScrollRef)}
          className="bg-cerrado-500 hover:bg-cerrado-600 h-8 w-8 rounded-full shadow-lg flex-shrink-0 absolute right-0 z-10"
        >
          <ChevronRight className="h-4 w-4 text-white" />
        </Button>
      </div>
      
      <div className="relative px-4 sm:px-8 md:px-12">
        <Carousel
          opts={carouselOpts}
          className="w-full events-carousel"
        >
          <CarouselContent className="-ml-1 sm:-ml-2 md:-ml-4">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <CarouselItem key={event.id} className="pl-1 sm:pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <div className="h-full">
                    <EventCard
                      key={event.id}
                      event={event}
                      onViewDetails={onViewEvent}
                    />
                  </div>
                </CarouselItem>
              ))
            ) : (
              <CarouselItem className="pl-1 sm:pl-2 md:pl-4 basis-full">
                <div className="h-40 flex items-center justify-center bg-gray-100 rounded-lg">
                  <p className="text-gray-500">Nenhum evento encontrado para os filtros selecionados</p>
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
          {filteredEvents.length > 0 && (
            <>
              <CarouselPrevious className="-left-3 sm:-left-7 md:-left-12" />
              <CarouselNext className="-right-3 sm:-right-7 md:-right-12" />
            </>
          )}
        </Carousel>
      </div>
      <div className="flex justify-center mt-6">
        <Button variant="outline" onClick={() => navigate('/events')}>Agenda Completa</Button>
      </div>
    </section>
  );
};

export default EventsSection;
