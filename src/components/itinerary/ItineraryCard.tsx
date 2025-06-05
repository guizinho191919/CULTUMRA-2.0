
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Itinerary } from '@/types';

interface ItineraryCardProps {
  itinerary: Itinerary;
  onViewDetails: (itinerary: Itinerary) => void;
}

const ItineraryCard = ({ itinerary, onViewDetails }: ItineraryCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      facil: 'bg-green-100 text-green-800',
      moderado: 'bg-yellow-100 text-yellow-800',
      dificil: 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyIcon = (difficulty: string) => {
    const icons = {
      facil: '😊',
      moderado: '😐',
      dificil: '😰'
    };
    return icons[difficulty as keyof typeof icons] || '📍';
  };

  // Função para obter ícones para as tags
  const getTagIcon = (tag: string) => {
    const icons: { [key: string]: string } = {
      'aventura': '🏃',
      'natureza': '🌿',
      'cultura': '🎭',
      'historia': '🏛️',
      'gastronomia': '🍽️',
      'pesca': '🎣',
      'navegacao': '⛵',
      'vida-selvagem': '🦁',
      'relaxamento': '🧘'
    };
    return icons[tag.toLowerCase()] || '🏷️';
  };

  return (
    <Card className="group overflow-hidden card-hover cursor-pointer h-full flex flex-col">
      <div className="relative h-48 overflow-hidden" onClick={() => onViewDetails(itinerary)}>
        <div className="grid grid-cols-2 gap-1 h-full">
          {/* Usar as 2 fotos do roteiro */}
          {itinerary.images.slice(0, 2).map((image, index) => (
            <div key={index} className="relative overflow-hidden">
              <img
                src={image || '/placeholder.svg'}
                alt={`${itinerary.name} - Foto ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          ))}
          
          {/* Se houver apenas 1 foto, usar foto dos spots como fallback */}
          {itinerary.images.length === 1 && itinerary.spots.slice(0, 1).map((spot, index) => (
            <div key={`spot-${index}`} className="relative overflow-hidden">
              <img
                src={spot.images[0] || '/placeholder.svg'}
                alt={spot.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
        
        {/* Filtros no canto superior esquerdo */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[70%]">
          {/* Badge de dificuldade */}
          <Badge className={`${getDifficultyColor(itinerary.difficulty)} border-0 text-xs flex items-center gap-1`}>
            <span>{getDifficultyIcon(itinerary.difficulty)}</span>
            <span>{itinerary.difficulty.charAt(0).toUpperCase() + itinerary.difficulty.slice(1)}</span>
          </Badge>
          
          {/* Tags como filtros */}
          {itinerary.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="bg-white/90 text-gray-800 border-0 text-xs flex items-center gap-1">
              <span>{getTagIcon(tag)}</span>
              <span>{tag.charAt(0).toUpperCase() + tag.slice(1)}</span>
            </Badge>
          ))}
          {itinerary.tags.length > 3 && (
            <Badge variant="secondary" className="bg-white/90 text-gray-800 border-0 text-xs">
              +{itinerary.tags.length - 3}
            </Badge>
          )}
        </div>
        
        <div className="absolute top-3 right-3">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            🔖
          </Button>
        </div>
      </div>

      <CardContent className="p-4 flex-1">
        <h3 className="font-semibold text-lg mb-2 group-hover:text-cerrado-600 transition-colors">
          {itinerary.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {itinerary.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span className="flex items-center">
            📅 {itinerary.duration} {parseInt(itinerary.duration) === 1 ? 'dia' : 'dias'}
          </span>
          <span className="flex items-center">
            📍 {itinerary.spots.length} paradas
          </span>
          <span className="font-medium text-cerrado-600">
            R$ {itinerary.estimatedCost.toLocaleString()}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-cerrado-600 hover:bg-cerrado-700"
          onClick={() => onViewDetails(itinerary)}
        >
          Ver Roteiro
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ItineraryCard;
