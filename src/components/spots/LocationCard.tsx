
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TouristSpot } from '@/types';

interface LocationCardProps {
  spot: TouristSpot;
}

const LocationCard = ({ spot }: LocationCardProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>📍</span>
          <span>Localização</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><strong>Cidade:</strong> {spot.location.city}</p>
          <p><strong>Estado:</strong> {spot.location.state}</p>
          <p><strong>Coordenadas:</strong> {spot.location.coordinates.lat}, {spot.location.coordinates.lng}</p>
          <Button variant="outline" className="w-full mt-4">
            🗺️ Ver no mapa
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationCard;
