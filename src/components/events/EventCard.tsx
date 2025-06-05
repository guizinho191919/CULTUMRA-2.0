
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Event } from '@/types';

interface EventCardProps {
  event: Event;
  onViewDetails: (event: Event) => void;
}

const EventCard = ({ event, onViewDetails }: EventCardProps) => {
  // Gerar imagem do evento baseada no ID
  const getEventImage = (id: string) => {
    const images = [
      'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=250&fit=crop', // Festival lights
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&h=250&fit=crop', // Music festival
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=250&fit=crop', // Cultural event
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=250&fit=crop', // Food festival
      'https://images.unsplash.com/photo-1471435374424-fef45bc0ca08?w=400&h=250&fit=crop', // Sports event
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=250&fit=crop'  // Traditional festival
    ];
    const index = parseInt(id) % images.length;
    return images[index];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const isUpcoming = event.date > new Date();
  const isToday = event.date.toDateString() === new Date().toDateString();

  return (
    <Card className="group overflow-hidden card-hover h-full flex flex-col">
      <div className="relative h-48 overflow-hidden flex-shrink-0" onClick={() => onViewDetails(event)}>
        <img
          src={getEventImage(event.id)}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute top-3 left-3">
          {isToday && (
            <Badge className="bg-red-500 border-0 text-white">
              ⏰ Hoje
            </Badge>
          )}
          {!isToday && isUpcoming && (
            <Badge className="bg-green-500 border-0 text-white">
              📅 Em breve
            </Badge>
          )}
          {!isUpcoming && !isToday && (
            <Badge className="bg-gray-500 border-0 text-white">
              ✅ Finalizado
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            🔔
          </Button>
        </div>

        <div className="absolute bottom-3 left-3 text-white">
          <div className="text-sm opacity-90">
            {formatDate(event.date)}
          </div>
        </div>

        {event.price > 0 && (
          <div className="absolute bottom-3 right-3">
            <Badge className="bg-dourado-500 border-0 text-white">
              R$ {event.price.toLocaleString()}
            </Badge>
          </div>
        )}
        
        {event.price === 0 && (
          <div className="absolute bottom-3 right-3">
            <Badge className="bg-green-500 border-0 text-white">
              Gratuito
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg mb-2 group-hover:text-cerrado-600 transition-colors">
          {event.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {event.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
          <span className="flex items-center">
            📍 {event.location.address}
          </span>
          <span className="flex items-center">
            👤 {event.organizer}
          </span>
        </div>

        <div className="mt-3">
          <Badge variant="secondary" className="text-xs">
            🏷️ {event.category}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex-shrink-0">
        <Button 
          className="w-full bg-cerrado-600 hover:bg-cerrado-700"
          onClick={() => onViewDetails(event)}
          disabled={!isUpcoming && !isToday}
        >
          {isUpcoming || isToday ? 'Ver Detalhes' : 'Evento Finalizado'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
