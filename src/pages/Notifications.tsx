
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trash2, Settings, CheckCircle2 } from 'lucide-react';

const Notifications = () => {
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAllNotifications 
  } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message': return '💬';
      case 'booking': return '📅';
      case 'event': return '🎉';
      case 'promotion': return '🎁';
      case 'system': return '⚙️';
      case 'payment': return '💳';
      case 'reminder': return '⏰';
      default: return '🔔';
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.action) {
      notification.action();
    } else if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const formatTime = (timestamp: Date) => {
    return formatDistanceToNow(timestamp, { 
      addSuffix: true, 
      locale: ptBR 
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-gray-200 bg-gray-50';
      default: return 'border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-4"
        >
          ← Voltar
        </Button>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold gradient-text mb-2">Notificações</h1>
              <p className="text-gray-600">
                {unreadCount > 0 
                  ? `${unreadCount} notificação${unreadCount > 1 ? 'ões' : ''} não lida${unreadCount > 1 ? 's' : ''}` 
                  : 'Todas as notificações foram lidas'
                }
              </p>
            </div>
            {notifications.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllNotifications}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Limpar todas</span>
              </Button>
            )}
          </div>
          
          {/* Barra de ações rápidas - apenas quando há notificações não lidas */}
          {unreadCount > 0 && (
            <div className="bg-white rounded-lg border p-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {unreadCount} notificação{unreadCount > 1 ? 'ões' : ''} não lida{unreadCount > 1 ? 's' : ''}
                </span>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="bg-cerrado-500 hover:bg-cerrado-600"
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Marcar como lidas
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {unreadCount > 0 && (
            <div className="text-right mb-2">
              <Button 
                variant="link" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-cerrado-600 hover:text-cerrado-700 p-0 h-auto"
              >
                Marcar todas como lidas
              </Button>
            </div>
          )}
          
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                !notification.read 
                  ? `${getPriorityColor(notification.priority)} border-l-4 border-l-cerrado-500` 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`font-medium ${
                          !notification.read ? 'text-cerrado-900' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {notification.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-gray-500">
                            {formatTime(notification.timestamp)}
                          </span>
                          {notification.priority === 'high' && (
                            <Badge variant="destructive" className="text-xs">
                              Urgente
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!notification.read && (
                          <Badge className="bg-cerrado-500">
                            Novo
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
              <Settings className="h-5 w-5" />
              <span>Configurações de Notificação</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/settings/notifications?section=general')}
            >
              <span className="mr-2">⚙️</span>
              Configurações Gerais
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/settings/notifications?section=messages')}
            >
              <span className="mr-2">💬</span>
              Configurar mensagens
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/settings/notifications?section=reservations')}
            >
              <span className="mr-2">📅</span>
              Configurar reservas
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/settings/notifications?section=events')}
            >
              <span className="mr-2">🎉</span>
              Configurar eventos
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/settings/notifications?section=promotions')}
            >
              <span className="mr-2">🎁</span>
              Configurar promoções
            </Button>
          </CardContent>
        </Card>
      </main>

      <Navigation />
    </div>
  );
};

export default Notifications;
