
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockTouristSpots } from '@/data/mockData';
import { useBackpack } from '@/hooks/useBackpack';
import ImageGallery from '@/components/spots/ImageGallery';
import SpotInfo from '@/components/spots/SpotInfo';
import SpotDetailedInfo from '@/components/spots/SpotDetailedInfo';
import LocationCard from '@/components/spots/LocationCard';
import ActionButtons from '@/components/spots/ActionButtons';

const SpotDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToBackpack, isInBackpack } = useBackpack();
  
  const spot = mockTouristSpots.find(s => s.id === id);

  if (!spot) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6 pb-20">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Destino não encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                O destino que você procura não existe ou foi removido.
              </p>
              <Button onClick={() => navigate('/explore')}>
                Explorar Destinos
              </Button>
            </CardContent>
          </Card>
        </main>
        <Navigation />
      </div>
    );
  }

  const handleAddToBackpack = () => {
    addToBackpack(spot);
  };

  const handleShareLocation = () => {
    if (navigator.share) {
      navigator.share({
        title: spot.name,
        text: spot.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  const getPriceEstimate = () => {
    const prices = {
      '$': 25,
      '$$': 65,
      '$$$': 125,
      '$$$$': 250
    };
    return prices[spot.priceRange as keyof typeof prices] || 50;
  };

  const inBackpack = isInBackpack(spot.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          ← Voltar
        </Button>

        <ImageGallery spot={spot} />
        
        <SpotInfo spot={spot} onShareLocation={handleShareLocation} />
        
        <SpotDetailedInfo spot={spot} />
        
        <LocationCard spot={spot} />

        <ActionButtons 
          spot={spot}
          inBackpack={inBackpack}
          onAddToBackpack={handleAddToBackpack}
          getPriceEstimate={getPriceEstimate}
        />
      </main>

      <Navigation />
    </div>
  );
};

export default SpotDetail;
