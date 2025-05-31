
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TouristSpot } from '@/types';

interface TouristSpotCardProps {
  spot: TouristSpot;
  onViewDetails: (spot: TouristSpot) => void;
}

const TouristSpotCard = ({ spot, onViewDetails }: TouristSpotCardProps) => {
  const getCategoryIcon = (category: string) => {
    const icons = {
      natureza: '🌿',
      aventura: '🏔️',
      cultura: '🎭',
      historia: '🏛️'
    };
    return icons[category as keyof typeof icons] || '📍';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      natureza: 'bg-cerrado-100 text-cerrado-800',
      aventura: 'bg-orange-100 text-orange-800',
      cultura: 'bg-purple-100 text-purple-800',
      historia: 'bg-yellow-100 text-yellow-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriceRange = (range: string) => {
    const ranges = {
      '$': 'Econômico',
      '$$': 'Moderado',
      '$$$': 'Caro',
      '$$$$': 'Premium'
    };
    return ranges[range as keyof typeof ranges] || 'Variado';
  };

  return (
    <Card className="group overflow-hidden card-hover cursor-pointer">
      <div 
        className="relative h-48 overflow-hidden"
        onClick={() => onViewDetails(spot)}
      >
        <img
          src={spot.images[0]}
          alt={spot.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-3 left-3">
          <Badge className={`${getCategoryColor(spot.category)} border-0`}>
            {getCategoryIcon(spot.category)} {spot.category.charAt(0).toUpperCase() + spot.category.slice(1)}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            ❤️
          </Button>
        </div>
        <div className="absolute bottom-3 left-3 text-white">
          <div className="flex items-center space-x-1">
            <span className="text-yellow-400">⭐</span>
            <span className="font-medium">{spot.rating.toFixed(1)}</span>
            <span className="text-sm opacity-80">({spot.reviews})</span>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 group-hover:text-cerrado-600 transition-colors">
          {spot.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {spot.description}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center">
            📍 {spot.location.city}
          </span>
          <span className="font-medium text-cerrado-600">
            {getPriceRange(spot.priceRange)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex flex-wrap gap-1 mb-3">
          {spot.features.slice(0, 3).map((feature, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {feature}
            </Badge>
          ))}
          {spot.features.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{spot.features.length - 3}
            </Badge>
          )}
        </div>
        <Button 
          className="w-full bg-cerrado-600 hover:bg-cerrado-700"
          onClick={() => onViewDetails(spot)}
        >
          Ver Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TouristSpotCard;
