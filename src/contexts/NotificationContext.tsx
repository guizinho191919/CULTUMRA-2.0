import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface Notification {
  id: string;
  type: 'message' | 'booking' | 'event' | 'promotion' | 'system' | 'payment' | 'reminder';
  title: string;
  description: string;
  time: string;
  timestamp: Date;
  read: boolean;
  action?: () => void;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  userId?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  getNotificationsByType: (type: string) => Notification[];
  getRecentNotifications: (limit?: number) => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Carregar notificações do localStorage quando o usuário faz login
  useEffect(() => {
    if (isAuthenticated && user) {
      const storedNotifications = localStorage.getItem(`notifications_${user.email}`);
      if (storedNotifications) {
        try {
          const parsed = JSON.parse(storedNotifications).map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp)
          }));
          setNotifications(parsed);
        } catch (error) {
          console.error('Error parsing stored notifications:', error);
        }
      } else {
        // Criar notificações iniciais para demonstração
        const initialNotifications = createInitialNotifications(user.email);
        setNotifications(initialNotifications);
      }
    } else {
      setNotifications([]);
    }
  }, [isAuthenticated, user]);

  // Salvar notificações no localStorage sempre que mudarem
  useEffect(() => {
    if (isAuthenticated && user && notifications.length > 0) {
      localStorage.setItem(`notifications_${user.email}`, JSON.stringify(notifications));
    }
  }, [notifications, isAuthenticated, user]);

  const createInitialNotifications = (userEmail: string): Notification[] => {
    const now = new Date();
    return [
      {
        id: '1',
        type: 'message',
        title: 'Nova mensagem de João Silva',
        description: 'Oi! Gostaria de agendar o tour para amanhã.',
        time: 'Há 5 minutos',
        timestamp: new Date(now.getTime() - 5 * 60 * 1000),
        read: false,
        actionUrl: '/chat/1',
        priority: 'high',
        userId: userEmail
      },
      {
        id: '2',
        type: 'booking',
        title: 'Reserva confirmada',
        description: 'Sua reserva para Chapada dos Guimarães foi confirmada.',
        time: 'Há 1 hora',
        timestamp: new Date(now.getTime() - 60 * 60 * 1000),
        read: false,
        actionUrl: '/bookings',
        priority: 'medium',
        userId: userEmail
      },
      {
        id: '3',
        type: 'event',
        title: 'Novo evento próximo a você',
        description: 'Festival de Pesca no Pantanal - 15 de Janeiro',
        time: 'Há 2 horas',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        read: true,
        actionUrl: '/events',
        priority: 'medium',
        userId: userEmail
      }
    ];
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    // Verificar se o tipo de notificação está habilitado
    const settings = localStorage.getItem(`notificationSettings_${user?.email}`);
    if (settings) {
      try {
        const parsedSettings = JSON.parse(settings);
        
        // Verificar se o tipo específico está habilitado
        switch (notification.type) {
          case 'message':
            if (!parsedSettings.messages?.enabled) return;
            break;
          case 'booking':
            if (!parsedSettings.reservations?.enabled) return;
            break;
          case 'event':
          case 'reminder':
            if (!parsedSettings.events?.enabled) return;
            break;
          case 'promotion':
            if (!parsedSettings.promotions?.enabled) return;
            break;
        }
      } catch (error) {
        console.error('Erro ao verificar configurações:', error);
      }
    }

    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
      userId: user?.email
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    if (user) {
      localStorage.removeItem(`notifications_${user.email}`);
    }
  };

  const getNotificationsByType = (type: string) => {
    return notifications.filter(notification => notification.type === type);
  };

  const getRecentNotifications = (limit: number = 5) => {
    return notifications
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Solicitar permissão para notificações do navegador
  useEffect(() => {
    if (isAuthenticated && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [isAuthenticated]);

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    getNotificationsByType,
    getRecentNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};