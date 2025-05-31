
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockItineraries } from '@/data/mockData';
import { ArrowLeft, MapPin, Clock, DollarSign, Users } from 'lucide-react';

const ItineraryDetail = () => {
  const { id } = useParams();
  const itinerary = mockItineraries.find(i => i.id === id);

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6 pb-20">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😞</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Roteiro não encontrado
            </h3>
            <Link to="/">
              <Button>Voltar ao início</Button>
            </Link>
          </div>
        </main>
        <Navigation />
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      facil: 'bg-green-100 text-green-800',
      moderado: 'bg-yellow-100 text-yellow-800',
      dificil: 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pb-20">
        {/* Hero Section */}
        <div className="relative h-80 md:h-96">
          <div className="grid grid-cols-2 gap-1 h-full">
            {itinerary.spots.slice(0, 4).map((spot, index) => (
              <div key={index} className="relative overflow-hidden">
                <img
                  src={spot.images[0]}
                  alt={spot.name}
                  className="w-full h-full object-cover"
                />
                {index === 3 && itinerary.spots.length > 4 && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      +{itinerary.spots.length - 4} locais
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-4 left-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
          </div>
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {itinerary.name}
            </h1>
            <div className="flex items-center space-x-3 text-white">
              <Badge className={`${getDifficultyColor(itinerary.difficulty)} border-0`}>
                {itinerary.difficulty.charAt(0).toUpperCase() + itinerary.difficulty.slice(1)}
              </Badge>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {itinerary.duration} {itinerary.duration === 1 ? 'dia' : 'dias'}
              </span>
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {itinerary.spots.length} paradas
              </span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {/* Quick Info */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <Clock className="w-6 h-6 mx-auto mb-2 text-cerrado-600" />
                  <div className="text-sm text-gray-600">Duração</div>
                  <div className="font-medium">{itinerary.duration} {itinerary.duration === 1 ? 'dia' : 'dias'}</div>
                </div>
                <div>
                  <MapPin className="w-6 h-6 mx-auto mb-2 text-cerrado-600" />
                  <div className="text-sm text-gray-600">Destinos</div>
                  <div className="font-medium">{itinerary.spots.length} locais</div>
                </div>
                <div>
                  <DollarSign className="w-6 h-6 mx-auto mb-2 text-cerrado-600" />
                  <div className="text-sm text-gray-600">Custo estimado</div>
                  <div className="font-medium">R$ {itinerary.estimatedCost.toLocaleString()}</div>
                </div>
                <div>
                  <Users className="w-6 h-6 mx-auto mb-2 text-cerrado-600" />
                  <div className="text-sm text-gray-600">Dificuldade</div>
                  <div className="font-medium capitalize">{itinerary.difficulty}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Sobre este roteiro</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">{itinerary.description}</p>
              <div className="flex flex-wrap gap-2">
                {itinerary.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Itinerary Spots */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Destinos do roteiro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {itinerary.spots.map((spot, index) => (
                  <div key={spot.id} className="flex space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-16 h-16 bg-cerrado-600 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-lg">{spot.name}</h4>
                          <p className="text-gray-600 text-sm mb-2">{spot.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {spot.location.city}
                            </span>
                            <span className="flex items-center">
                              ⭐ {spot.rating}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {spot.category}
                            </Badge>
                          </div>
                        </div>
                        <img
                          src={spot.images[0]}
                          alt={spot.name}
                          className="w-20 h-16 object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button size="lg" className="h-12">
              <span className="mr-2">🎯</span>
              Seguir este roteiro
            </Button>
            <Button size="lg" variant="outline" className="h-12">
              <span className="mr-2">❤️</span>
              Salvar roteiro
            </Button>
            <Button size="lg" variant="outline" className="h-12">
              <span className="mr-2">📱</span>
              Compartilhar
            </Button>
          </div>
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default ItineraryDetail;
