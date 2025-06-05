
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications] = useState([
    {
      id: '1',
      type: 'message',
      title: 'Nova mensagem de João Silva',
      description: 'Oi! Gostaria de agendar o tour para amanhã.',
      time: 'Há 5 minutos',
      read: false,
      action: () => navigate('/chat/1')
    },
    {
      id: '2',
      type: 'booking',
      title: 'Reserva confirmada',
      description: 'Sua reserva para Chapada dos Guimarães foi confirmada.',
      time: 'Há 1 hora',
      read: false,
      action: () => navigate('/spot/1')
    },
    {
      id: '3',
      type: 'event',
      title: 'Novo evento próximo a você',
      description: 'Festival de Pesca no Pantanal - 15 de Janeiro',
      time: 'Há 2 horas',
      read: true,
      action: () => navigate('/events')
    },
    {
      id: '4',
      type: 'message',
      title: 'Maria Santos respondeu',
      description: 'Obrigada pela avaliação! Espero vê-lo novamente.',
      time: 'Ontem',
      read: true,
      action: () => navigate('/chat/2')
    },
    {
      id: '5',
      type: 'promotion',
      title: 'Oferta especial',
      description: '20% de desconto em tours no Pantanal!',
      time: 'Há 2 dias',
      read: true,
      action: () => navigate('/explore')
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message': return '💬';
      case 'booking': return '📅';
      case 'event': return '🎉';
      case 'promotion': return '🎁';
      default: return '🔔';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold gradient-text mb-2">Notificações</h1>
            <p className="text-gray-600">
              {unreadCount > 0 ? `${unreadCount} notificação${unreadCount > 1 ? 'ões' : ''} não lida${unreadCount > 1 ? 's' : ''}` : 'Todas as notificações foram lidas'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm">
              Marcar todas como lidas
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                !notification.read ? 'bg-cerrado-50 border-cerrado-200' : ''
              }`}
              onClick={notification.action}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`font-medium ${!notification.read ? 'text-cerrado-900' : 'text-gray-900'}`}>
                          {notification.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {notification.description}
                        </p>
                        <span className="text-xs text-gray-500 mt-2 block">
                          {notification.time}
                        </span>
                      </div>
                      {!notification.read && (
                        <Badge className="bg-cerrado-500 ml-2">
                          Novo
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {notifications.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🔔</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma notificação
              </h3>
              <p className="text-gray-600">
                Você está em dia! Quando houver novidades, elas aparecerão aqui.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>⚙️</span>
              <span>Configurações de Notificação</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <span className="mr-2">💬</span>
              Configurar notificações de mensagens
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <span className="mr-2">📅</span>
              Configurar notificações de reservas
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <span className="mr-2">🎉</span>
              Configurar notificações de eventos
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <span className="mr-2">🎁</span>
              Configurar notificações promocionais
            </Button>
          </CardContent>
        </Card>
      </main>

      <Navigation />
    </div>
  );
};

export default Notifications;
