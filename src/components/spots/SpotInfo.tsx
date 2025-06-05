
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TouristSpot } from '@/types';

interface SpotInfoProps {
  spot: TouristSpot;
  onShareLocation: () => void;
}

const SpotInfo = ({ spot, onShareLocation }: SpotInfoProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl gradient-text">{spot.name}</CardTitle>
            <p className="text-gray-600 mt-1">📍 {spot.location.city}, {spot.location.state}</p>
          </div>
          <Button variant="outline" size="sm" onClick={onShareLocation}>
            📤 Compartilhar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">{spot.description}</p>
        
        {/* Features */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Características</h3>
          <div className="flex flex-wrap gap-2">
            {spot.features.map((feature, index) => (
              <Badge key={index} variant="secondary">
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        {/* Activities */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Atividades</h3>
          <div className="flex flex-wrap gap-2">
            {spot.activities.map((activity, index) => (
              <Badge key={index} variant="outline">
                {activity}
              </Badge>
            ))}
          </div>
        </div>

        {/* Best Season */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Melhor época para visitar</h3>
          <p className="text-gray-600">{spot.bestSeason}</p>
        </div>

        {/* Difficulty */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Nível de dificuldade</h3>
          <Badge variant="outline" className="text-sm">
            {spot.difficulty}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpotInfo;
