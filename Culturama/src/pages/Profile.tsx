
import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { AUTH_EVENT } from '../App';

const Profile = () => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
    navigate('/login');
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar o tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "A foto deve ter no máximo 5MB",
        variant: "destructive",
      });
      return;
    }

    // Verificar o tipo do arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione uma imagem",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const updatedUser = { ...user, photoUrl: event.target.result as string };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Disparar evento de autenticação para atualizar o estado em App.tsx
        window.dispatchEvent(new Event(AUTH_EVENT));
        
        toast({
          title: "Foto atualizada",
          description: "Sua foto de perfil foi atualizada com sucesso",
        });
      }
    };
    reader.readAsDataURL(file);
  };

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
    { label: 'Eventos participados', value: '3', icon: '🎉' },
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
            <div className="flex items-center space-x-4">
              <div 
                className="relative cursor-pointer" 
                onClick={handlePhotoClick}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
                {user.photoUrl ? (
                  <Avatar className="w-20 h-20 border-2 border-cerrado-500">
                    <AvatarImage src={user.photoUrl} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-cerrado-500 to-pantanal-500 text-white font-bold text-2xl">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-cerrado-500 to-pantanal-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 rounded-full flex items-center justify-center transition-all duration-200">
                  <span className="text-white opacity-0 hover:opacity-100">Alterar</span>
                </div>
              </div>
              <div className="flex-1">
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

        {/* Quick Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>⚙️</span>
              <span>Ações Rápidas</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/explore">
              <Button variant="outline" className="w-full justify-start">
                <span className="mr-2">🗺️</span>
                Explorar novos destinos
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start">
              <span className="mr-2">❤️</span>
              Meus favoritos
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <span className="mr-2">📅</span>
              Minhas reservas
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <span className="mr-2">💳</span>
              Métodos de pagamento
            </Button>
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
