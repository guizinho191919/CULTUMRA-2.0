
import { useState } from 'react';

export interface ScheduledEvent {
  id: string;
  type: 'destination' | 'restaurant';
  itemId: string;
  title: string;
  location: string;
  date: Date;
  time: string;
  color: string;
  image?: string;
  price?: number; // Adicionar campo de preço
}

export const useScheduling = () => {
  const [scheduledEvents, setScheduledEvents] = useState<ScheduledEvent[]>(() => {
    try {
      const stored = localStorage.getItem('scheduledEvents');
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      return parsed.map((event: any) => ({
        ...event,
        date: new Date(event.date)
      }));
    } catch (error) {
      console.error('Error parsing scheduled events from localStorage:', error);
      return [];
    }
  });

  const addScheduledEvent = (event: Omit<ScheduledEvent, 'id'>) => {
    const newEvent: ScheduledEvent = {
      ...event,
      id: `${event.type}-${event.itemId}-${Date.now()}`,
    };
    
    const updatedEvents = [...scheduledEvents, newEvent];
    setScheduledEvents(updatedEvents);
    
    try {
      // Convert Date objects to ISO strings for storage
      const eventsToStore = updatedEvents.map(e => ({
        ...e,
        date: e.date.toISOString()
      }));
      localStorage.setItem('scheduledEvents', JSON.stringify(eventsToStore));
    } catch (error) {
      console.error('Error saving scheduled events to localStorage:', error);
    }
  };

  const removeScheduledEvent = (eventId: string) => {
    const updatedEvents = scheduledEvents.filter(event => event.id !== eventId);
    setScheduledEvents(updatedEvents);
    
    try {
      // Convert Date objects to ISO strings for storage
      const eventsToStore = updatedEvents.map(e => ({
        ...e,
        date: e.date.toISOString()
      }));
      localStorage.setItem('scheduledEvents', JSON.stringify(eventsToStore));
    } catch (error) {
      console.error('Error saving scheduled events to localStorage:', error);
    }
  };

  const getEventsForDate = (date: Date) => {
    return scheduledEvents.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  return {
    scheduledEvents,
    addScheduledEvent,
    removeScheduledEvent,
    getEventsForDate,
  };
};
