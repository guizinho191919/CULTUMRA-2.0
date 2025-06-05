
import { useNavigate } from 'react-router-dom';
import { useMemo, useState, useRef } from 'react';
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
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ItinerariesSectionProps {
  itineraries: Itinerary[];
  onViewItinerary: (itinerary: Itinerary) => void;
}

const ItinerariesSection = ({ itineraries, onViewItinerary }: ItinerariesSectionProps) => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('todos');
  const scrollRef = useRef<HTMLDivElement>(null);

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

  // Extrair todas as tags únicas dos itinerários
  const categories = useMemo(() => {
  // Começar com a categoria "todos"
  const result = [{ id: 'todos', name: 'Todas', icon: '📍', count: itineraries.length }];
  
  // Coletar todas as tags únicas
  const uniqueTags = new Set<string>();
  itineraries.forEach(itinerary => {
    itinerary.tags.forEach(tag => uniqueTags.add(tag));
  });
  
  // Mapear ícones para tags comuns
  const tagIcons: Record<string, string> = {
    'aventura': '🏃',
    'natureza': '🌿',
    'cultura': '🎭',
    'gastronomia': '🍽️',
    'relaxamento': '🧘',
    'historia': '🏛️',
    'pesca': '🎣',
    'vida-selvagem': '🦁',
    'navegacao': '⛵',
    // Adicione mais mapeamentos conforme necessário
  };
  
  // Adicionar cada tag como uma categoria
  Array.from(uniqueTags).sort().forEach(tag => {
    result.push({
      id: tag,
      name: tag.charAt(0).toUpperCase() + tag.slice(1),
      icon: tagIcons[tag] || '🏷️',
      count: itineraries.filter(i => i.tags.includes(tag)).length
    });
  });
  
  return result;
}, [itineraries]);

  // Filtrar roteiros com base na tag selecionada
  const filteredItineraries = useMemo(() => {
    if (activeFilter === 'todos') {
      return itineraries;
    }
    return itineraries.filter(itinerary => 
      itinerary.tags.includes(activeFilter) ||
      (activeFilter === 'relaxamento' && itinerary.tags.includes('sustentabilidade'))
    );
  }, [itineraries, activeFilter]);

  // Embaralhar os roteiros filtrados para exibição aleatória
  const randomizedItineraries = useMemo(() => {
    // Cria uma cópia do array para não modificar o original
    return [...filteredItineraries].sort(() => Math.random() - 0.5);
  }, [filteredItineraries]);

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
    <section className="space-y-6">
      <div className="flex items-center">
        <h2 className="text-3xl font-bold gradient-text">📍 Roteiros Recomendados</h2>
      </div>
      
      {/* Filtro horizontal */}
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

        {/* Container dos filtros */}
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
