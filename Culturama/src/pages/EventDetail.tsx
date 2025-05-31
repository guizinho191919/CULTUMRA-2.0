
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockEvents } from '@/data/mockData';

const EventDetail = () => {
  const { id } = useParams();
  const event = mockEvents.find(e => e.id === id);

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6 pb-20">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😞</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Evento não encontrado
            </h3>
            <Link to="/search">
              <Button>Buscar eventos</Button>
            </Link>
          </div>
        </main>
        <Navigation />
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pb-20">
        {/* Hero Image */}
        <div className="relative h-80 md:h-96">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <Badge className="bg-white/20 text-white border-white/20 mb-2">
              {event.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {event.title}
            </h1>
            <div className="flex items-center space-x-4 text-white">
              <div className="flex items-center space-x-1">
                <span>📅</span>
                <span>{formatDate(event.date)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {/* Quick Info */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl mb-1">📅</div>
                  <div className="text-sm text-gray-600">Data</div>
                  <div className="font-medium">
                    {event.date.toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <div>
                  <div className="text-2xl mb-1">🕒</div>
                  <div className="text-sm text-gray-600">Horário</div>
                  <div className="font-medium">
                    {event.date.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-2xl mb-1">💰</div>
                  <div className="text-sm text-gray-600">Preço</div>
                  <div className="font-medium">
                    {event.price === 0 ? 'Gratuito' : `R$ ${event.price}`}
                  </div>
                </div>
                <div>
                  <div className="text-2xl mb-1">🏷️</div>
                  <div className="text-sm text-gray-600">Categoria</div>
                  <div className="font-medium">{event.category}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Sobre o evento</h2>
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            </CardContent>
          </Card>

          {/* Organizer & Location */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Organização e local</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">👤</span>
                  <div>
                    <div className="font-medium">Organizador</div>
                    <div className="text-gray-600">{event.organizer}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xl">📍</span>
                  <div>
                    <div className="font-medium">Local</div>
                    <div className="text-gray-600">{event.location.address}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Event Details */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Detalhes do evento</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">O que esperar:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center space-x-2">
                      <span className="text-cerrado-600">✓</span>
                      <span>Experiência única em Mato Grosso</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-cerrado-600">✓</span>
                      <span>Atividades para toda a família</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-cerrado-600">✓</span>
                      <span>Contato com a cultura local</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-cerrado-600">✓</span>
                      <span>Oportunidades fotográficas incríveis</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Informações importantes:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center space-x-2">
                      <span className="text-yellow-600">⚠️</span>
                      <span>Chegue 30 minutos antes do início</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-yellow-600">⚠️</span>
                      <span>Traga protetor solar e chapéu</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-yellow-600">⚠️</span>
                      <span>Use roupas confortáveis</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-yellow-600">⚠️</span>
                      <span>Hidrate-se bem durante o evento</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button size="lg" className="h-12">
              <span className="mr-2">🎫</span>
              {event.price === 0 ? 'Confirmar presença' : 'Comprar ingresso'}
            </Button>
            <Button size="lg" variant="outline" className="h-12">
              <span className="mr-2">📱</span>
              Compartilhar evento
            </Button>
          </div>
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default EventDetail;
