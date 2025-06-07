import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface NotificationSettings {
  messages: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
    frequency: 'immediate' | 'hourly' | 'daily';
  };
  reservations: {
    enabled: boolean;
    confirmations: boolean;
    reminders: boolean;
    cancellations: boolean;
    reminderTime: '1hour' | '2hours' | '1day';
  };
  events: {
    enabled: boolean;
    newEvents: boolean;
    reminders: boolean;
    updates: boolean;
    reminderTime: '1hour' | '2hours' | '1day';
  };
  promotions: {
    enabled: boolean;
    discounts: boolean;
    newOffers: boolean;
    frequency: 'immediate' | 'daily' | 'weekly';
  };
}

const defaultSettings: NotificationSettings = {
  messages: {
    enabled: true,
    sound: true,
    vibration: true,
    frequency: 'immediate'
  },
  reservations: {
    enabled: true,
    confirmations: true,
    reminders: true,
    cancellations: true,
    reminderTime: '2hours'
  },
  events: {
    enabled: true,
    newEvents: true,
    reminders: true,
    updates: true,
    reminderTime: '1day'
  },
  promotions: {
    enabled: false,
    discounts: true,
    newOffers: true,
    frequency: 'weekly'
  }
};

export const useNotificationSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);

  // Carregar configurações do localStorage
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`notificationSettings_${user.email}`);
      if (saved) {
        try {
          setSettings(JSON.parse(saved));
        } catch (error) {
          console.error('Erro ao carregar configurações:', error);
          setSettings(defaultSettings);
        }
      }
    }
  }, [user]);

  // Salvar configurações
  const saveSettings = (newSettings: NotificationSettings) => {
    if (user) {
      setSettings(newSettings);
      localStorage.setItem(`notificationSettings_${user.email}`, JSON.stringify(newSettings));
    }
  };

  // Atualizar configuração específica
  const updateSetting = (category: keyof NotificationSettings, key: string, value: any) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value
      }
    };
    saveSettings(newSettings);
  };

  // Verificar se um tipo de notificação está habilitado
  const isNotificationEnabled = (type: 'message' | 'booking' | 'event' | 'promotion') => {
    switch (type) {
      case 'message':
        return settings.messages.enabled;
      case 'booking':
        return settings.reservations.enabled;
      case 'event':
        return settings.events.enabled;
      case 'promotion':
        return settings.promotions.enabled;
      default:
        return true;
    }
  };

  // Resetar para configurações padrão
  const resetToDefaults = () => {
    saveSettings(defaultSettings);
  };

  return {
    settings,
    saveSettings,
    updateSetting,
    isNotificationEnabled,
    resetToDefaults
  };
};