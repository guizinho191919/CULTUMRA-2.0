import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Settings, Bell, MessageSquare, Calendar, Gift, AlertTriangle } from 'lucide-react';

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

const NotificationSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const section = searchParams.get('section');
  
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('notificationSettings');
    return saved ? JSON.parse(saved) : {
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
  });

  const saveSettings = () => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    toast({
      title: "Configurações salvas",
      description: "Suas preferências foram atualizadas.",
    });
  };

  const updateSettings = (category: keyof NotificationSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  // Função para renderizar apenas a seção específica
  const renderSection = () => {
    switch (section) {
      case 'messages':
        return renderMessagesSection();
      case 'reservations':
        return renderReservationsSection();
      case 'events':
        return renderEventsSection();
      case 'promotions':
        return renderPromotionsSection();
      default:
        return renderAllSections();
    }
  };

  const renderMessagesSection = () => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            <span className="text-sm sm:text-base">Mensagens</span>
          </div>
          <Badge variant={settings.messages.enabled ? "default" : "secondary"} className="text-xs">
            {settings.messages.enabled ? 'Ativo' : 'Inativo'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Mensagens</span>
            <Switch
              checked={settings.messages.enabled}
              onCheckedChange={(checked) => updateSettings('messages', 'enabled', checked)}
            />
          </div>
          <p className="text-xs text-gray-500">Guias e estabelecimentos</p>
          
          {settings.messages.enabled && (
            <div className="space-y-3 pl-4 border-l-2 border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm">Som</span>
                <Switch
                  checked={settings.messages.sound}
                  onCheckedChange={(checked) => updateSettings('messages', 'sound', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Vibração</span>
                <Switch
                  checked={settings.messages.vibration}
                  onCheckedChange={(checked) => updateSettings('messages', 'vibration', checked)}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderReservationsSection = () => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            <span className="text-sm sm:text-base">Reservas</span>
          </div>
          <Badge variant={settings.reservations.enabled ? "default" : "secondary"} className="text-xs">
            {settings.reservations.enabled ? 'Ativo' : 'Inativo'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Reservas</span>
            <Switch
              checked={settings.reservations.enabled}
              onCheckedChange={(checked) => updateSettings('reservations', 'enabled', checked)}
            />
          </div>
          <p className="text-xs text-gray-500">Restaurantes e hospedagens</p>
          
          {settings.reservations.enabled && (
            <div className="space-y-3 pl-4 border-l-2 border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm">Confirmações</span>
                <Switch
                  checked={settings.reservations.confirmations}
                  onCheckedChange={(checked) => updateSettings('reservations', 'confirmations', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Lembretes</span>
                <Switch
                  checked={settings.reservations.reminders}
                  onCheckedChange={(checked) => updateSettings('reservations', 'reminders', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Cancelamentos</span>
                <Switch
                  checked={settings.reservations.cancellations}
                  onCheckedChange={(checked) => updateSettings('reservations', 'cancellations', checked)}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderEventsSection = () => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            <span className="text-sm sm:text-base">Eventos</span>
          </div>
          <Badge variant={settings.events.enabled ? "default" : "secondary"} className="text-xs">
            {settings.events.enabled ? 'Ativo' : 'Inativo'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Eventos</span>
            <Switch
              checked={settings.events.enabled}
              onCheckedChange={(checked) => updateSettings('events', 'enabled', checked)}
            />
          </div>
          <p className="text-xs text-gray-500">Novos eventos e lembretes</p>
          
          {settings.events.enabled && (
            <div className="space-y-3 pl-4 border-l-2 border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm">Novos eventos</span>
                <Switch
                  checked={settings.events.newEvents}
                  onCheckedChange={(checked) => updateSettings('events', 'newEvents', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Lembretes</span>
                <Switch
                  checked={settings.events.reminders}
                  onCheckedChange={(checked) => updateSettings('events', 'reminders', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Atualizações</span>
                <Switch
                  checked={settings.events.updates}
                  onCheckedChange={(checked) => updateSettings('events', 'updates', checked)}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderPromotionsSection = () => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <Gift className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
            <span className="text-sm sm:text-base">Promoções</span>
          </div>
          <Badge variant={settings.promotions.enabled ? "default" : "secondary"} className="text-xs">
            {settings.promotions.enabled ? 'Ativo' : 'Inativo'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Promoções</span>
            <Switch
              checked={settings.promotions.enabled}
              onCheckedChange={(checked) => updateSettings('promotions', 'enabled', checked)}
            />
          </div>
          <p className="text-xs text-gray-500">Descontos e ofertas</p>
          
          {settings.promotions.enabled && (
            <div className="space-y-3 pl-4 border-l-2 border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm">Descontos</span>
                <Switch
                  checked={settings.promotions.discounts}
                  onCheckedChange={(checked) => updateSettings('promotions', 'discounts', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Novas ofertas</span>
                <Switch
                  checked={settings.promotions.newOffers}
                  onCheckedChange={(checked) => updateSettings('promotions', 'newOffers', checked)}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderAllSections = () => (
    <>
      {renderMessagesSection()}
      {renderReservationsSection()}
      {renderEventsSection()}
      {renderPromotionsSection()}
    </>
  );

  // Atualizar o título baseado na seção
  const getSectionTitle = () => {
    switch (section) {
      case 'messages': return 'Configurações de Mensagens';
      case 'reservations': return 'Configurações de Reservas';
      case 'events': return 'Configurações de Eventos';
      case 'promotions': return 'Configurações de Promoções';
      default: return 'Configurações';
    }
  };

  const getSectionDescription = () => {
    switch (section) {
      case 'messages': return 'Configure como receber mensagens de guias e estabelecimentos';
      case 'reservations': return 'Configure alertas para suas reservas';
      case 'events': return 'Configure alertas para eventos e lembretes';
      case 'promotions': return 'Configure alertas para promoções e ofertas';
      default: return 'Personalize como e quando você recebe alertas';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/notifications')}
          className="mb-4"
        >
          ← Voltar
        </Button>

        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold gradient-text mb-2">
            {getSectionTitle()}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {getSectionDescription()}
          </p>
        </div>

        {renderSection()}

        <div className="flex justify-end mt-6">
          <Button 
            onClick={saveSettings}
            className="bg-cerrado-600 hover:bg-cerrado-700 text-white"
          >
            Salvar Configurações
          </Button>
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default NotificationSettings;