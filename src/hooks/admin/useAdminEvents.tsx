
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Event } from '@/types/admin';
import { saveToStorage, loadFromStorage } from './storageUtils';

export const useAdminEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    const savedEvents = loadFromStorage('admin_events');
    if (savedEvents) {
      setEvents(savedEvents);
    } else {
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Festival de Inverno de Bonito',
          description: 'Festival cultural com música e gastronomia',
          date: '2024-07-15',
          time: '18:00',
          location: 'Bonito, MS',
          price: 80,
          maxParticipants: 500,
          currentParticipants: 320,
          status: 'active',
          featured: true,
          category: 'Cultural',
          createdAt: '2024-04-01'
        }
      ];
      setEvents(mockEvents);
      saveToStorage('admin_events', mockEvents);
    }
  };

  const createEvent = (eventData: Partial<Event>) => {
    const newEvent: Event = {
      id: Date.now().toString(),
      title: eventData.title || '',
      description: eventData.description || '',
      date: eventData.date || '',
      time: eventData.time || '',
      location: eventData.location || '',
      price: eventData.price || 0,
      maxParticipants: eventData.maxParticipants || 50,
      currentParticipants: 0,
      status: 'active',
      featured: false,
      category: eventData.category || 'Cultural',
      createdAt: new Date().toISOString(),
      ...eventData
    };
    
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    saveToStorage('admin_events', updatedEvents);
    
    toast({
      title: "Evento criado",
      description: `${newEvent.title} foi adicionado com sucesso.`
    });
    
    return newEvent;
  };

  const updateEvent = (eventId: string, updates: Partial<Event>) => {
    const updatedEvents = events.map(event => 
      event.id === eventId ? { ...event, ...updates } : event
    );
    setEvents(updatedEvents);
    saveToStorage('admin_events', updatedEvents);
    
    toast({
      title: "Evento atualizado",
      description: "As informações foram salvas com sucesso."
    });
  };

  const deleteEvent = (eventId: string) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    saveToStorage('admin_events', updatedEvents);
    
    toast({
      title: "Evento removido",
      description: "O item foi excluído do sistema."
    });
  };

  return {
    events,
    createEvent,
    updateEvent,
    deleteEvent
  };
};
