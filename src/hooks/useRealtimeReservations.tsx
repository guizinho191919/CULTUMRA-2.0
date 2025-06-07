import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRealtimeSync } from './useRealtimeSync';

interface Reservation {
  id: string;
  userId: string;
  guideId?: string;
  spotId?: string;
  restaurantId?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  date: string;
  time: string;
  price: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: number;
  updatedAt: number;
}

export const useRealtimeReservations = () => {
  const { user } = useAuth();
  const { syncData, syncEvents } = useRealtimeSync();
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Carrega reservas do localStorage
  useEffect(() => {
    let savedReservations: Reservation[] = [];
    
    if (user?.userType === 'guide') {
      // Guias veem reservas onde são o guia
      const userReservations = JSON.parse(localStorage.getItem('userReservations') || '[]');
      savedReservations = userReservations.filter((res: Reservation) => res.guideId === user.id);
    } else {
      // Usuários veem suas próprias reservas
      const userReservations = JSON.parse(localStorage.getItem('userReservations') || '[]');
      savedReservations = userReservations.filter((res: Reservation) => res.userId === user?.id);
    }
    
    setReservations(savedReservations);
  }, [user]);

  // Escuta eventos de sincronização
  useEffect(() => {
    const reservationEvents = syncEvents.filter(event => 
      event.type === 'reservation' && 
      (event.data.userId === user?.id || event.data.guideId === user?.id)
    );

    if (reservationEvents.length > 0) {
      const latestEvent = reservationEvents[reservationEvents.length - 1];
      const updatedReservation = latestEvent.data;
      
      setReservations(prev => {
        const index = prev.findIndex(res => res.id === updatedReservation.id);
        let updated;
        
        if (index >= 0) {
          updated = [...prev];
          updated[index] = updatedReservation;
        } else {
          updated = [...prev, updatedReservation];
        }
        
        // Atualiza localStorage
        const allReservations = JSON.parse(localStorage.getItem('userReservations') || '[]');
        const globalIndex = allReservations.findIndex((res: Reservation) => res.id === updatedReservation.id);
        
        if (globalIndex >= 0) {
          allReservations[globalIndex] = updatedReservation;
        } else {
          allReservations.push(updatedReservation);
        }
        
        localStorage.setItem('userReservations', JSON.stringify(allReservations));
        return updated;
      });
    }
  }, [syncEvents, user?.id]);

  const updateReservationStatus = useCallback((reservationId: string, status: Reservation['status']) => {
    setReservations(prev => {
      const updated = prev.map(res => 
        res.id === reservationId 
          ? { ...res, status, updatedAt: Date.now() }
          : res
      );
      
      // Atualiza localStorage global
      const allReservations = JSON.parse(localStorage.getItem('userReservations') || '[]');
      const globalUpdated = allReservations.map((res: Reservation) => 
        res.id === reservationId 
          ? { ...res, status, updatedAt: Date.now() }
          : res
      );
      localStorage.setItem('userReservations', JSON.stringify(globalUpdated));
      
      // Sincroniza mudança
      const updatedReservation = updated.find(res => res.id === reservationId);
      if (updatedReservation) {
        syncData('reservation', updatedReservation, updatedReservation.userId);
      }
      
      return updated;
    });
  }, [syncData]);

  return {
    reservations,
    updateReservationStatus
  };
};