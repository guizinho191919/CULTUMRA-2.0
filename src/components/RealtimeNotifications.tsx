import React, { useEffect, useState } from 'react';
import { useRealtimeSync } from '../hooks/useRealtimeSync';
import { useAuth } from '../contexts/AuthContext';
import { Bell, MessageCircle, Calendar, CheckCircle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'message' | 'reservation' | 'status';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export const RealtimeNotifications: React.FC = () => {
  const { user } = useAuth();
  const { syncEvents } = useRealtimeSync();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Carrega notificações existentes
    const saved = JSON.parse(localStorage.getItem(`notifications_${user?.id}`) || '[]');
    setNotifications(saved);
  }, [user?.id]);

  useEffect(() => {
    // Processa novos eventos de sincronização
    const relevantEvents = syncEvents.filter(event => 
      event.userId !== user?.id && // Não notifica sobre próprias ações
      (event.data.userId === user?.id || event.data.guideId === user?.id)
    );

    relevantEvents.forEach(event => {
      let notification: Notification;
      
      switch (event.type) {
        case 'message':
          notification = {
            id: `notif_${Date.now()}_${Math.random()}`,
            type: 'message',
            title: 'Nova mensagem',
            message: `Você recebeu uma nova mensagem`,
            timestamp: event.timestamp,
            read: false
          };
          break;
          
        case 'reservation':
          notification = {
            id: `notif_${Date.now()}_${Math.random()}`,
            type: 'reservation',
            title: 'Reserva atualizada',
            message: `Status da reserva alterado para: ${event.data.status}`,
            timestamp: event.timestamp,
            read: false
          };
          break;
          
        default:
          return;
      }
      
      setNotifications(prev => {
        const updated = [notification, ...prev];
        localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(updated));
        return updated;
      });
    });
  }, [syncEvents, user?.id]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageCircle className="w-4 h-4" />;
      case 'reservation': return <Calendar className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900">Notificações</h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Nenhuma notificação
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};