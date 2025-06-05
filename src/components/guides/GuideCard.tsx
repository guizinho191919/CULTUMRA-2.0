
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
    <Card className="group overflow-hidden card-hover h-full flex flex-col">
      <CardContent className="p-4 sm:p-6 flex-1 flex flex-col">
        {/* Layout unificado para todos os dispositivos */}
        <div className="flex flex-col md:flex-row md:items-start md:space-x-4">
          {/* Seção de foto e informações principais */}
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-0 flex-shrink-0">
            <div className="relative mb-2">
              <div className="w-20 h-20 md:w-16 md:h-16 rounded-full overflow-hidden">
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
            
            {/* Avaliação centralizada em mobile */}
            <div className="flex items-center space-x-1 mb-2 md:hidden">
              <span className="text-yellow-400">⭐</span>
              <span className="font-medium">{guide.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-500">({guide.reviews})</span>
            </div>
            
            {/* Preço destacado em mobile */}
            <div className="md:hidden text-center">
              <span className="font-medium text-cerrado-600 text-lg">
                R$ {guide.pricePerHour}/hora
              </span>
            </div>
          </div>

          {/* Conteúdo principal */}
          <div className="flex-1 flex flex-col">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between text-center md:text-left">
              <div>
                <h3 className="font-semibold text-lg group-hover:text-cerrado-600 transition-colors">
                  {guide.name}
                </h3>
                {/* Avaliação apenas em tablet/desktop */}
                <div className="hidden md:flex items-center space-x-1 mt-1">
                  <span className="text-yellow-400">⭐</span>
                  <span className="font-medium">{guide.rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">({guide.reviews} avaliações)</span>
                </div>
              </div>
              <Badge variant="outline" className="text-xs hidden md:inline-flex">
                Cadastur: {guide.cadasturId}
              </Badge>
            </div>

            {/* Cadastur em mobile */}
            <div className="flex justify-center md:hidden mb-2">
              <Badge variant="outline" className="text-xs">
                Cadastur: {guide.cadasturId}
              </Badge>
            </div>

            <p className="text-gray-600 text-sm mt-2 mb-3 text-center md:text-left md:line-clamp-2">
              {guide.description}
            </p>

            {/* Informações em grid para mobile, flex para desktop */}
            <div className="grid grid-cols-2 gap-2 md:flex md:items-center md:space-x-4 mt-1 mb-3 text-sm text-gray-500 text-center md:text-left">
              <span>🎯 {guide.experience} anos</span>
              <span>🗣️ {guide.languages.join(', ')}</span>
              {/* Preço apenas em tablet/desktop */}
              <span className="hidden md:inline-block font-medium text-cerrado-600">
                R$ {guide.pricePerHour}/hora
              </span>
            </div>

            {/* Especialidades */}
            <div className="flex flex-wrap justify-center md:justify-start gap-1 mt-auto">
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

      <CardFooter className="p-4 sm:p-6 pt-0 flex-shrink-0">
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
