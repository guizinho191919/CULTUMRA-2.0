import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRealtimeSync } from './useRealtimeSync';
import { useNotifications } from '../contexts/NotificationContext';

interface CalendarEvent {
  id: string;
  type: 'booking' | 'availability_change' | 'cancellation';
  guideId?: string;
  establishmentId?: string;
  clientId: string;
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  details: {
    serviceName: string;
    location: string;
    price?: number;
  };
}

export const useCalendarSync = () => {
  const { user } = useAuth();
  const { syncData } = useRealtimeSync();
  const { addNotification } = useNotifications();
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  // Sincronizar evento de agendamento
  const syncBookingEvent = useCallback((event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    // Adicionar ao estado local
    setCalendarEvents(prev => [...prev, newEvent]);

    // Sincronizar com outros usuários
    syncData('calendar', {
      action: 'new_booking',
      event: newEvent
    }, event.guideId || event.establishmentId);

    // Notificar partes interessadas
    if (user?.userType !== 'admin' && user?.userType !== 'guide' && user?.userType !== 'restaurant') {
      // Cliente fez agendamento - notificar guia/estabelecimento
      addNotification({
        type: 'booking',
        title: 'Novo agendamento solicitado',
        description: `${event.details.serviceName} em ${event.date.toLocaleDateString()}`,
        time: 'Agora',
        priority: 'high'
      });
    }
  }, [user, syncData, addNotification]);

  // Confirmar/rejeitar agendamento (guia/estabelecimento)
  const updateBookingStatus = useCallback((eventId: string, status: 'confirmed' | 'cancelled', reason?: string) => {
    setCalendarEvents(prev => {
      const updatedEvents = prev.map(event => 
        event.id === eventId ? { ...event, status } : event
      );
      
      const event = updatedEvents.find(e => e.id === eventId);
      if (event) {
        // Sincronizar mudança de status
        syncData('calendar', {
          action: 'status_update',
          eventId,
          status,
          reason
        }, event.clientId);

        // Notificar cliente
        addNotification({
          type: status === 'confirmed' ? 'booking' : 'system',
          title: status === 'confirmed' ? 'Agendamento confirmado!' : 'Agendamento cancelado',
          description: `${event.details.serviceName} - ${status === 'confirmed' ? 'Confirmado' : reason || 'Cancelado'}`,
          time: 'Agora',
          priority: 'high'
        });
      }
      
      return updatedEvents;
    });
  }, [syncData, addNotification]);

  // Atualizar disponibilidade (guia/estabelecimento)
  const updateAvailability = useCallback((date: Date, timeSlots: string[], available: boolean) => {
    syncData('calendar', {
      action: 'availability_update',
      date,
      timeSlots,
      available,
      providerId: user?.id
    });

    // Notificar clientes com agendamentos pendentes
    addNotification({
      type: 'system',
      title: 'Disponibilidade atualizada',
      description: `Horários ${available ? 'liberados' : 'bloqueados'} para ${date.toLocaleDateString()}`,
      time: 'Agora',
      priority: 'medium'
    });
  }, [user, syncData, addNotification]);

  // Escutar eventos de sincronização
  useEffect(() => {
    const handleCalendarSync = (event: CustomEvent) => {
      const syncEvent = event.detail;
      if (syncEvent.type === 'calendar') {
        const { action, event: calendarEvent, eventId, status, date, timeSlots, available } = syncEvent.data;

        switch (action) {
          case 'new_booking':
            if (user?.userType === 'admin' || user?.userType === 'guide' || user?.userType === 'restaurant') {
              setCalendarEvents(prev => [...prev, calendarEvent]);
              addNotification({
                type: 'booking',
                title: 'Nova solicitação de agendamento',
                description: `${calendarEvent.details.serviceName} solicitado para ${calendarEvent.date.toLocaleDateString()}`,
                time: 'Agora',
                priority: 'high'
              });
            }
            break;

          case 'status_update':
            if (user?.userType !== 'admin' && user?.userType !== 'guide' && user?.userType !== 'restaurant') {
              setCalendarEvents(prev => 
                prev.map(e => e.id === eventId ? { ...e, status } : e)
              );
            }
            break;

          case 'availability_update':
            if (user?.userType !== 'admin' && user?.userType !== 'guide' && user?.userType !== 'restaurant') {
              addNotification({
                type: 'system',
                title: 'Disponibilidade alterada',
                description: `Horários ${available ? 'liberados' : 'bloqueados'} para ${new Date(date).toLocaleDateString()}`,
                time: 'Agora',
                priority: 'medium'
              });
            }
            break;
        }
      }
    };

    // Escutar eventos de sincronização
    window.addEventListener('sync-event', handleCalendarSync);
    
    return () => {
      window.removeEventListener('sync-event', handleCalendarSync);
    };
  }, [user, addNotification]);

  return {
    calendarEvents,
    syncBookingEvent,
    updateBookingStatus,
    updateAvailability
  };
};