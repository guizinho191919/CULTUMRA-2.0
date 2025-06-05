
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Reservation } from '@/types/admin';
import { saveToStorage, loadFromStorage } from './storageUtils';

export const useAdminReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = () => {
    const savedReservations = loadFromStorage('admin_reservations');
    if (savedReservations) {
      setReservations(savedReservations);
    } else {
      const mockReservations: Reservation[] = [
        {
          id: '1',
          userId: '1',
          userName: 'João Silva',
          itemId: '1',
          itemName: 'Pantanal Adventure',
          itemType: 'itinerary',
          date: '2024-06-15',
          participants: 2,
          totalAmount: 900,
          status: 'confirmed',
          paymentStatus: 'paid',
          createdAt: '2024-05-01'
        }
      ];
      setReservations(mockReservations);
      saveToStorage('admin_reservations', mockReservations);
    }
  };

  const updateReservation = (reservationId: string, updates: Partial<Reservation>) => {
    const updatedReservations = reservations.map(reservation => 
      reservation.id === reservationId ? { ...reservation, ...updates } : reservation
    );
    setReservations(updatedReservations);
    saveToStorage('admin_reservations', updatedReservations);
    
    toast({
      title: "Reserva atualizada",
      description: "O status foi alterado com sucesso."
    });
  };

  return {
    reservations,
    updateReservation
  };
};
