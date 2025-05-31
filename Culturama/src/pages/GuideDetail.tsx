
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockGuides } from '@/data/mockData';

const GuideDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const guide = mockGuides.find(g => g.id === id);

  if (!guide) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6 pb-20">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🧭</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Guia não encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                O guia que você procura não existe ou foi removido.
              </p>
              <Button onClick={() => navigate('/search')}>
                Buscar Guias
              </Button>
            </CardContent>
          </Card>
        </main>
        <Navigation />
      </div>
    );
  }

  const getGuidePhoto = (id: string) => {
    const photos = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=300&h=300&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face'
    ];
    const index = parseInt(id) % photos.length;
    return photos[index];
  };

  const handleStartChat = () => {
    navigate(`/chat/${guide.id}`);
  };

  const handleBookService = () => {
    alert('Funcionalidade de contratação será implementada em breve!');
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

        {/* Guide Profile */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden">
                  <img
                    src={getGuidePhoto(guide.id)}
                    alt={guide.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {guide.availability && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold gradient-text">{guide.name}</h1>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="font-medium">{guide.rating.toFixed(1)}</span>
                        <span className="text-sm text-gray-500">({guide.reviews} avaliações)</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Cadastur: {guide.cadasturId}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                      <span>🎯 {guide.experience} anos de experiência</span>
                      <span>🗣️ {guide.languages.join(', ')}</span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-cerrado-600">
                        R$ {guide.pricePerHour}
                      </div>
                      <div className="text-sm text-gray-500">por hora</div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mt-4">{guide.description}</p>

                {/* Action Buttons */}
                <div className="flex space-x-3 mt-6">
                  <Button 
                    className="flex-1 bg-cerrado-600 hover:bg-cerrado-700"
                    onClick={handleStartChat}
                  >
                    💬 Iniciar Chat
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={handleBookService}
                  >
                    📅 Contratar Serviço
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Specialties */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🎯</span>
              <span>Especialidades</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {guide.specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {specialty}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🛎️</span>
              <span>Serviços Oferecidos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">🗺️</span>
                <div>
                  <h4 className="font-medium">Tours Personalizados</h4>
                  <p className="text-sm text-gray-600">Roteiros sob medida para seus interesses</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">🏃</span>
                <div>
                  <h4 className="font-medium">Atividades de Aventura</h4>
                  <p className="text-sm text-gray-600">Trilhas, escaladas e esportes radicais</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">📷</span>
                <div>
                  <h4 className="font-medium">Tours Fotográficos</h4>
                  <p className="text-sm text-gray-600">Capture os melhores momentos</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">🌿</span>
                <div>
                  <h4 className="font-medium">Ecoturismo</h4>
                  <p className="text-sm text-gray-600">Turismo sustentável e consciente</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>⭐</span>
              <span>Avaliações Recentes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: 'Ana Maria',
                  rating: 5,
                  comment: 'Excelente guia! Muito conhecedor da região e super atencioso.',
                  date: 'Há 1 semana'
                },
                {
                  name: 'Carlos Santos',
                  rating: 5,
                  comment: 'Tour incrível no Pantanal. Recomendo para todos!',
                  date: 'Há 2 semanas'
                },
                {
                  name: 'Mariana Lima',
                  rating: 4,
                  comment: 'Ótima experiência, guia muito profissional.',
                  date: 'Há 1 mês'
                }
              ].map((review, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h5 className="font-medium">{review.name}</h5>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-700 text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Ver todas as avaliações
            </Button>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📞</span>
              <span>Informações de Contato</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-lg">💬</span>
                <span>Chat disponível 24/7</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-lg">📱</span>
                <span>WhatsApp: (65) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-lg">📧</span>
                <span>Email: {guide.name.toLowerCase().replace(' ', '.')}@email.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-lg">🕒</span>
                <span>Responde em média em 2 horas</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Navigation />
    </div>
  );
};

export default GuideDetail;
