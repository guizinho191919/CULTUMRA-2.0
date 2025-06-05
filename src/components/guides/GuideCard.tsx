
import React from 'react';
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

  // Função para obter ícone para cada especialidade (sem cores específicas)
  const getSpecialtyIcon = (specialty: string) => {
    const specialtyMap: { [key: string]: string } = {
      'centro histórico': '🏛️',
      'gastronomia local': '🍽️',
      'festas tradicionais': '🎭',
      'ecoturismo': '🌿',
      'comunidades tradicionais': '🏘️',
      'artesanato': '🎨',
      'aventura': '🏔️',
      'cultural': '🎭',
      'histórico': '🏛️',
      'gastronômico': '🍽️',
      'religioso': '⛪',
      'rural': '🌾',
      'urbano': '🏙️',
      'pantanal': '🐟',
      'observação de fauna': '🦎',
      'pesca esportiva': '🎣',
      'navegação': '⛵',
      'acampamento': '⛺',
      'trekking': '🥾',
      'rapel': '🧗',
      'cachoeiras': '💧'
    };
    
    const normalizedSpecialty = specialty.toLowerCase();
    return specialtyMap[normalizedSpecialty] || '🔍';
  };

  return (
    <Card className="group overflow-hidden card-hover cursor-pointer h-full flex flex-col">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {/* Máximo 2 badges + contador se necessário */}
        <div className="absolute top-3 left-3 flex gap-1 z-10">
          {guide.specialties.slice(0, 2).map((specialty, index) => {
            const icon = getSpecialtyIcon(specialty);
            return (
              <Badge 
                key={index} 
                className="bg-white/90 text-gray-800 border-0 text-xs flex items-center gap-1 whitespace-nowrap"
              >
                <span>{icon}</span>
                <span>{specialty}</span>
              </Badge>
            );
          })}
          {guide.specialties.length > 2 && (
            <Badge className="bg-white/90 text-gray-800 border-0 text-xs">
              +{guide.specialties.length - 2}
            </Badge>
          )}
        </div>
        
        {/* Avaliação no inferior esquerdo */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="bg-white/95 px-2 py-1 rounded-full flex items-center space-x-1 shadow-sm">
            <span className="text-yellow-500">⭐</span>
            <span className="text-sm font-medium text-gray-800">{guide.rating.toFixed(1)}</span>
          </div>
        </div>
        
        {/* Foto do guia e balão de fala */}
        <div className="absolute inset-0 flex items-center px-4">
          <div className="flex items-center w-full">
            {/* Foto de perfil circular */}
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0 z-10">
              <img
                src={getGuidePhoto(guide.id)}
                alt={guide.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
            {/* Balão de fala */}
            <div className="relative ml-3 bg-white p-3 rounded-lg shadow-sm max-w-[70%] z-0">
              <div className="absolute left-[-8px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-r-[12px] border-r-white border-b-8 border-b-transparent"></div>
              <p className="text-sm text-gray-700 italic">"{guide.description.split('.')[0]}."</p>
            </div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg group-hover:text-cerrado-600 transition-colors line-clamp-1">
            {guide.name}
          </h3>
          <span className="text-cerrado-600 font-medium text-sm">
            R$ {guide.pricePerHour}/hora
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">
          {guide.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center">
            <span className="mr-1">🎯</span>
            {guide.experience} anos de experiência
          </span>
          <span className="flex items-center">
            <span className="mr-1">🗣️</span>
            {guide.languages.length} idiomas
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <div className="flex space-x-2 w-full">
          <Button 
            variant="outline" 
            className="flex-1 border-gray-300 text-gray-700"
            onClick={() => onViewProfile(guide)}
          >
            Ver Perfil
          </Button>
          <Button 
            className="flex-1 bg-cerrado-600 hover:bg-cerrado-700 text-white"
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
