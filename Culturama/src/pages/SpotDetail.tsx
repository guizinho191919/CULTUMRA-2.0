
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockTouristSpots } from '@/data/mockData';

const SpotDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
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

  const handleBooking = () => {
    // Simular navegação para tela de reserva
    alert('Funcionalidade de reserva será implementada em breve!');
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

        {/* Image Gallery */}
        <Card className="mb-6 overflow-hidden">
          <div className="relative h-64 md:h-96">
            <img
              src={spot.images[selectedImageIndex]}
              alt={spot.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <div className="bg-white/90 px-3 py-1 rounded-full flex items-center space-x-1">
                <span className="text-yellow-500">⭐</span>
                <span className="font-medium">{spot.rating}</span>
                <span className="text-sm text-gray-600">({spot.reviews})</span>
              </div>
            </div>
            <div className="absolute bottom-4 left-4">
              <Badge className="bg-white/90 text-gray-800">
                {spot.priceRange}
              </Badge>
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

        {/* Spot Info */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl gradient-text">{spot.name}</CardTitle>
                <p className="text-gray-600 mt-1">📍 {spot.location.city}, {spot.location.state}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleShareLocation}>
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

        {/* Location */}
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

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button 
            className="w-full bg-cerrado-600 hover:bg-cerrado-700"
            onClick={handleBooking}
          >
            📅 Fazer Reserva
          </Button>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => navigate('/search?q=guias')}>
              🧭 Encontrar Guia
            </Button>
            <Button variant="outline">
              ❤️ Adicionar aos Favoritos
            </Button>
          </div>
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default SpotDetail;
