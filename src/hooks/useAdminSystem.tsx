
import { useState } from 'react';
import { useAdminUsers } from './admin/useAdminUsers';
import { useAdminSpots } from './admin/useAdminSpots';
import { useAdminItineraries } from './admin/useAdminItineraries';
import { useAdminEvents } from './admin/useAdminEvents';
import { useAdminReservations } from './admin/useAdminReservations';
import { usePaymentUtils } from './admin/paymentUtils';

export const useAdminSystem = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    users,
    createUser,
    updateUser,
    deleteUser,
    updateUserBalance
  } = useAdminUsers();
  
  const {
    spots,
    createSpot,
    updateSpot,
    deleteSpot
  } = useAdminSpots();
  
  const {
    itineraries,
    createItinerary,
    updateItinerary,
    deleteItinerary
  } = useAdminItineraries();
  
  const {
    events,
    createEvent,
    updateEvent,
    deleteEvent
  } = useAdminEvents();
  
  const {
    reservations,
    updateReservation
  } = useAdminReservations();
  
  const {
    generatePixKey,
    generateQRCode
  } = usePaymentUtils();

  const loadAllData = () => {
    setIsLoading(true);
    // Data is automatically loaded by individual hooks
    setIsLoading(false);
  };

  return {
    // Data
    users,
    spots,
    itineraries,
    events,
    reservations,
    isLoading,
    
    // Actions
    createUser,
    updateUser,
    deleteUser,
    updateUserBalance,
    createSpot,
    updateSpot,
    deleteSpot,
    createItinerary,
    updateItinerary,
    deleteItinerary,
    createEvent,
    updateEvent,
    deleteEvent,
    updateReservation,
    generatePixKey,
    generateQRCode,
    loadAllData
  };
};
