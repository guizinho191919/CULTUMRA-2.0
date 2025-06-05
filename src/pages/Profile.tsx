
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import ProfilePictureUpload from '@/components/profile/ProfilePictureUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirecionar usuários guia e comerciante para seus respectivos dashboards
  useEffect(() => {
    if (user) {
      // Check both userType and email as fallback
      if (user.userType === 'guide' || user.email?.endsWith('@guia.com.br')) {
        navigate('/dashboard/guide', { replace: true });
        return;
      } else if (user.userType === 'restaurant' || user.email?.endsWith('@comercio.com.br')) {
        navigate('/dashboard/restaurant', { replace: true });
        return;
      }
    }
  }, [user, navigate]);
  
  const [reservations] = useState(() => {
    const stored = localStorage.getItem('reservations');
    return stored ? JSON.parse(stored) : [];
  });
  
  const [restaurantReservations] = useState(() => {
    const stored = localStorage.getItem('restaurantReservations');
    return stored ? JSON.parse(stored) : [];
  });

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
    navigate('/'); // Mudança aqui: redireciona para Home ao invés de /login
  };

  // Se o usuário não estiver autenticado ou se estiver carregando, mostre a mensagem de login
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6 pb-20">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👤</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Faça login para ver seu perfil
            </h3>
            <Link to="/login">
              <Button>Fazer Login</Button>
            </Link>
          </div>
        </main>
        <Navigation />
      </div>
    );
  }

  const profileStats = [
    { label: 'Destinos visitados', value: '12', icon: '🗺️' },
    { label: 'Avaliações feitas', value: '8', icon: '⭐' },
    { label: 'Guias contratados', value: '5', icon: '🧭' },
    { label: 'Reservas ativas', value: (reservations.length + restaurantReservations.length).toString(), icon: '📅' },
  ];

  const recentActivity = [
    { action: 'Visitou', place: 'Chapada dos Guimarães', date: 'Há 2 dias' },
    { action: 'Avaliou', place: 'Pantanal Adventure', date: 'Há 1 semana' },
    { action: 'Reservou', place: 'Tour Cuiabá Histórica', date: 'Há 2 semanas' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <ProfilePictureUpload />
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold gradient-text">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
                <div className="mt-2">
                  <Badge className="bg-cerrado-100 text-cerrado-700">
                    Explorador Aventureiro
                  </Badge>
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {profileStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-cerrado-600">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Minha Aventura */}
        {(reservations.length > 0 || restaurantReservations.length > 0) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🗺️</span>
                <span>Minha Aventura</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Reservas de pontos turísticos */}
                {reservations.map((reservation: any) => (
                  <div 
                    key={reservation.id} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => navigate(`/voucher/${reservation.id}/spot`)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-cerrado-200 to-pantanal-200 rounded-lg flex items-center justify-center">
                        <span>🗺️</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{reservation.spot.name}</h4>
                        <p className="text-sm text-gray-600">
                          Reservado em {new Date(reservation.purchaseDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-700 mb-1">
                        {reservation.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                      </Badge>
                      <p className="text-sm font-medium">R$ {reservation.totalPaid.toFixed(2)}</p>
                    </div>
                  </div>
                ))}

                {/* Reservas de restaurantes */}
                {restaurantReservations.map((reservation: any) => (
                  <div 
                    key={reservation.id} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => navigate(`/voucher/${reservation.id}/restaurant`)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-200 to-red-200 rounded-lg flex items-center justify-center">
                        <span>🍽️</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{reservation.restaurant.name}</h4>
                        <p className="text-sm text-gray-600">
                          Reservado em {new Date(reservation.purchaseDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-700 mb-1">
                        {reservation.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                      </Badge>
                      <p className="text-sm font-medium">R$ {reservation.totalPaid.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>⚙️</span>
              <span>Ações Rápidas</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Dashboard access buttons based on user type */}
            {user.userType === 'admin' && (
              <Link to="/admin" className="block">
                <Button variant="outline" className="w-full justify-start text-left h-auto py-3 bg-blue-50 hover:bg-blue-100">
                  <span className="text-lg mr-3">🔧</span>
                  <span className="text-sm font-medium">Painel de Administração</span>
                </Button>
              </Link>
            )}
            {user.userType === 'guide' && (
              <Link to="/dashboard/guide" className="block">
                <Button variant="outline" className="w-full justify-start text-left h-auto py-3 bg-green-50 hover:bg-green-100">
                  <span className="text-lg mr-3">🧭</span>
                  <span className="text-sm font-medium">Dashboard de Guia</span>
                </Button>
              </Link>
            )}
            {user.userType === 'restaurant' && (
              <Link to="/dashboard/restaurant" className="block">
                <Button variant="outline" className="w-full justify-start text-left h-auto py-3 bg-orange-50 hover:bg-orange-100">
                  <span className="text-lg mr-3">🍽️</span>
                  <span className="text-sm font-medium">Dashboard de Restaurante</span>
                </Button>
              </Link>
            )}
            
            {/* Existing buttons */}
            <Link to="/backpack" className="block">
              <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
                <span className="text-lg mr-3">🎒</span>
                <span className="text-sm font-medium">Ver minha mochila</span>
              </Button>
            </Link>
            
            <Link to="/wallet" className="block">
              <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
                <span className="text-lg mr-3">💳</span>
                <span className="text-sm font-medium">Minha Carteira</span>
              </Button>
            </Link>
            <Link to="/calendar" className="block">
              <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
                <span className="text-lg mr-3">📅</span>
                <span className="text-sm font-medium">Meu Calendário</span>
              </Button>
            </Link>
            <Link to="/explore" className="block">
              <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
                <span className="text-lg mr-3">🗺️</span>
                <span className="text-sm font-medium">Explorar novos destinos</span>
              </Button>
            </Link>
            <Link to="/explore-food" className="block">
              <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
                <span className="text-lg mr-3">🍽️</span>
                <span className="text-sm font-medium">Explore Comidas</span>
              </Button>
            </Link>
            <Link to="/favorites" className="block">
              <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
                <span className="text-lg mr-3">❤️</span>
                <span className="text-sm font-medium">Meus favoritos</span>
              </Button>
            </Link>
            <Link to="/support" className="block">
              <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
                <span className="text-lg mr-3">🎧</span>
                <span className="text-sm font-medium">Suporte</span>
              </Button>
            </Link>
            {(reservations.length > 0 || restaurantReservations.length > 0) && (
              <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
                <span className="text-lg mr-3">🗺️</span>
                <span className="text-sm font-medium">Minha Aventura</span>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📈</span>
              <span>Atividade Recente</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">
                      {activity.action} <span className="text-cerrado-600">{activity.place}</span>
                    </p>
                    <p className="text-sm text-gray-500">{activity.date}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Ver detalhes
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <Navigation />
    </div>
  );
};

export default Profile;
