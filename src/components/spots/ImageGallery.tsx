
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { TouristSpot } from '@/types';

interface ImageGalleryProps {
  spot: TouristSpot;
}

const ImageGallery = ({ spot }: ImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Função para ícones das categorias
  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'natureza': '🌿',
      'aventura': '🏔️',
      'cultura': '🎭',
      'historia': '🏛️',
      'gastronomia': '🍽️',
      'ecoturismo': '🌱',
      'todos': '🗺️'
    };
    return icons[category.toLowerCase()] || '📍';
  };

  return (
    <Card className="mb-6 overflow-hidden">
      <div className="relative h-64 md:h-96">
        <img
          src={spot.images[selectedImageIndex]}
          alt={spot.name}
          className="w-full h-full object-cover"
        />
        
        {/* Categorias no canto superior esquerdo */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-1 max-w-[60%]">
          {spot.categories.slice(0, 3).map((category, index) => (
            <Badge 
              key={index} 
              className="bg-white/90 text-gray-800 border-0 text-xs flex items-center gap-1"
            >
              <span>{getCategoryIcon(category)}</span>
              <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
            </Badge>
          ))}
          {spot.categories.length > 3 && (
            <Badge className="bg-white/90 text-gray-800 border-0 text-xs">
              +{spot.categories.length - 3}
            </Badge>
          )}
        </div>

        {/* Avaliação no canto superior direito */}
        <div className="absolute top-4 right-4">
          <div className="bg-white/95 px-3 py-2 rounded-full flex items-center space-x-2 shadow-sm">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-gray-800">{spot.rating}</span>
            <span className="text-sm text-gray-600">({spot.reviews})</span>
          </div>
        </div>
      </div>
      {spot.images.length > 1 && (
        <div className="p-4">
          <div className="flex space-x-2 overflow-x-auto">
            {spot.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                  selectedImageIndex === index ? 'border-cerrado-500' : 'border-gray-200'
                }`}
              >
                <img
                  src={image}
                  alt={`${spot.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default ImageGallery;
