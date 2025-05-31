
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Guide } from '@/types';

interface GuideCardProps {
  guide: Guide;
  onViewProfile: (guide: Guide) => void;
  onStartChat: (guide: Guide) => void;
}

const GuideCard = ({ guide, onViewProfile, onStartChat }: GuideCardProps) => {
  // Gerar foto fictícia baseada no ID do guia
  const getGuidePhoto = (id: string) => {
    const photos = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
    ];
    const index = parseInt(id) % photos.length;
    return photos[index];
  };

  return (
    <Card className="group overflow-hidden card-hover">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <img
                src={getGuidePhoto(guide.id)}
                alt={guide.name}
                className="w-full h-full object-cover"
              />
            </div>
            {guide.availability && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg group-hover:text-cerrado-600 transition-colors">
                  {guide.name}
                </h3>
                <div className="flex items-center space-x-1 mt-1">
                  <span className="text-yellow-400">⭐</span>
                  <span className="font-medium">{guide.rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">({guide.reviews} avaliações)</span>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                Cadastur: {guide.cadasturId}
              </Badge>
            </div>

            <p className="text-gray-600 text-sm mt-2 line-clamp-2">
              {guide.description}
            </p>

            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
              <span>🎯 {guide.experience} anos</span>
              <span>🗣️ {guide.languages.join(', ')}</span>
              <span className="font-medium text-cerrado-600">
                R$ {guide.pricePerHour}/hora
              </span>
            </div>

            <div className="flex flex-wrap gap-1 mt-3">
              {guide.specialties.slice(0, 3).map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
              {guide.specialties.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{guide.specialties.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <div className="flex space-x-2 w-full">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onViewProfile(guide)}
          >
            Ver Perfil
          </Button>
          <Button 
            className="flex-1 bg-cerrado-600 hover:bg-cerrado-700"
            onClick={() => onStartChat(guide)}
          >
            💬 Chat
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default GuideCard;
