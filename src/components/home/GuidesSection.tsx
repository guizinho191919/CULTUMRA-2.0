
import { useNavigate } from 'react-router-dom';
import { useMemo, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import GuideCard from '@/components/guides/GuideCard';
import { Guide } from '@/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GuidesSectionProps {
  guides: Guide[];
  onViewGuideProfile: (guide: Guide) => void;
  onStartChat: (guide: Guide) => void;
}

const GuidesSection = ({ guides, onViewGuideProfile, onStartChat }: GuidesSectionProps) => {
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

  // Categorias de especialidades com contadores
  const categories = useMemo(() => {
    return [
      { id: 'todos', name: 'Todos', icon: '🧭', count: guides.length },
      { id: 'trekking', name: 'Trekking', icon: '🥾', count: guides.filter(g => g.specialties.some(s => s.toLowerCase().includes('trekking') || s.toLowerCase().includes('trilha'))).length },
      { id: 'rapel', name: 'Rapel', icon: '🧗', count: guides.filter(g => g.specialties.some(s => s.toLowerCase().includes('rapel') || s.toLowerCase().includes('escalada'))).length },
      { id: 'centro-historico', name: 'Centro Histórico', icon: '🏛️', count: guides.filter(g => g.specialties.some(s => s.toLowerCase().includes('histórico') || s.toLowerCase().includes('história'))).length },
      { id: 'gastronomia', name: 'Gastronomia Local', icon: '🍽️', count: guides.filter(g => g.specialties.some(s => s.toLowerCase().includes('gastronomia') || s.toLowerCase().includes('culinária'))).length },
      { id: 'festas-tradicionais', name: 'Festas Tradicionais', icon: '🎭', count: guides.filter(g => g.specialties.some(s => s.toLowerCase().includes('festa') || s.toLowerCase().includes('tradição'))).length },
      { id: 'pantanal', name: 'Pantanal', icon: '🐊', count: guides.filter(g => g.specialties.some(s => s.toLowerCase().includes('pantanal'))).length },
      { id: 'fauna', name: 'Observação de Fauna', icon: '🦎', count: guides.filter(g => g.specialties.some(s => s.toLowerCase().includes('fauna') || s.toLowerCase().includes('observação'))).length },
      { id: 'pesca', name: 'Pesca Esportiva', icon: '🎣', count: guides.filter(g => g.specialties.some(s => s.toLowerCase().includes('pesca'))).length }
    ];
  }, [guides]);

  // Filtrar guias com base na especialidade selecionada
  const filteredGuides = useMemo(() => {
    if (activeFilter === 'todos') {
      return guides;
    }
    return guides.filter(guide => 
      guide.specialties.some(specialty => {
        const spec = specialty.toLowerCase();
        switch (activeFilter) {
          case 'trekking':
            return spec.includes('trekking') || spec.includes('trilha');
          case 'rapel':
            return spec.includes('rapel') || spec.includes('escalada');
          case 'centro-historico':
            return spec.includes('histórico') || spec.includes('história');
          case 'gastronomia':
            return spec.includes('gastronomia') || spec.includes('culinária');
          case 'festas-tradicionais':
            return spec.includes('festa') || spec.includes('tradição');
          case 'pantanal':
            return spec.includes('pantanal');
          case 'fauna':
            return spec.includes('fauna') || spec.includes('observação');
          case 'pesca':
            return spec.includes('pesca');
          default:
            return spec.includes(activeFilter);
        }
      })
    );
  }, [guides, activeFilter]);

  // Embaralhar os guias filtrados para exibição aleatória
  const randomizedGuides = useMemo(() => {
    // Cria uma cópia do array para não modificar o original
    return [...filteredGuides].sort(() => Math.random() - 0.5);
  }, [filteredGuides]);

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
        <h2 className="text-3xl font-bold gradient-text">🧭 Guias Especializados</h2>
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
            {randomizedGuides.map((guide) => (
              <CarouselItem key={guide.id} className="pl-2 md:pl-4 basis-full md:basis-full lg:basis-1/2 xl:basis-1/3">
                <div className="h-full">
                  <GuideCard
                    guide={guide}
                    onViewProfile={onViewGuideProfile}
                    onStartChat={onStartChat}
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
        <Button variant="outline" onClick={() => navigate('/guides')}>Ver Todos</Button>
      </div>
    </section>
  );
};

export default GuidesSection;
