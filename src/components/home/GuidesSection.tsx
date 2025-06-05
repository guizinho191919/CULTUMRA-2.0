
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
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

interface GuidesSectionProps {
  guides: Guide[];
  onViewGuideProfile: (guide: Guide) => void;
  onStartChat: (guide: Guide) => void;
}

const GuidesSection = ({ guides, onViewGuideProfile, onStartChat }: GuidesSectionProps) => {
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

  // Embaralhar os guias para exibição aleatória
  const randomizedGuides = useMemo(() => {
    // Cria uma cópia do array para não modificar o original
    return [...guides].sort(() => Math.random() - 0.5);
  }, [guides]);

  return (
    <section className="space-y-6">
      <div className="flex items-center">
        <h2 className="text-3xl font-bold gradient-text">🧭 Guias Especializados</h2>
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
