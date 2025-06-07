import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface SyncData {
  type: 'reservation' | 'message' | 'status' | 'calendar';
  data: any;
  timestamp: number;
  userId?: string;
  guideId?: string;
}

export const useRealtimeSync = () => {
  const { user } = useAuth();
  const [syncEvents, setSyncEvents] = useState<SyncData[]>([]);

  // Função para enviar dados sincronizados
  const syncData = useCallback((type: SyncData['type'], data: any, targetUserId?: string) => {
    const syncEvent: SyncData = {
      type,
      data,
      timestamp: Date.now(),
      userId: user?.id,
      guideId: user?.userType === 'guide' ? user.id : targetUserId
    };

    // Salva no localStorage
    const existingEvents = JSON.parse(localStorage.getItem('sync_events') || '[]');
    const updatedEvents = [...existingEvents, syncEvent];
    localStorage.setItem('sync_events', JSON.stringify(updatedEvents));

    // Dispara evento customizado para notificar outras abas/componentes
    window.dispatchEvent(new CustomEvent('storage-sync', { detail: syncEvent }));
  }, [user]);

  // Escuta mudanças no localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sync_events' && e.newValue) {
        const events = JSON.parse(e.newValue);
        setSyncEvents(events);
      }
    };

    const handleCustomSync = (e: CustomEvent) => {
      const syncEvent = e.detail as SyncData;
      setSyncEvents(prev => [...prev, syncEvent]);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('storage-sync', handleCustomSync as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storage-sync', handleCustomSync as EventListener);
    };
  }, []);

  return { syncData, syncEvents };
};