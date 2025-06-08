import { useState, useEffect, useCallback } from 'react';
import { AvailabilityRequest, AvailabilityResponse, DayAvailability } from '../types/guide-availability';
import { guideAvailabilityService } from '../services/guide-availability.service';

export const useGuideAvailability = (guideId: string) => {
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailability = useCallback(async (request: Omit<AvailabilityRequest, 'guideId'>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await guideAvailabilityService.getAvailability({
        ...request,
        guideId
      });
      setAvailability(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [guideId]);

  const createBooking = useCallback(async (booking: {
    startDate: string;
    endDate: string;
    startTime: string;
    duration: number;
    clientId: string;
  }) => {
    try {
      const result = await guideAvailabilityService.createBooking(guideId, booking);
      
      // Atualizar disponibilidade após criar reserva
      if (result.success) {
        await fetchAvailability({
          startDate: booking.startDate,
          endDate: booking.endDate,
          duration: booking.duration
        });
      }
      
      return result;
    } catch (err) {
      throw err;
    }
  }, [guideId, fetchAvailability]);

  const isDateAvailable = useCallback((date: string): boolean => {
    if (!availability) return false;
    
    const dayAvailability = availability.availability.find(day => day.date === date);
    return dayAvailability?.isAvailable || false;
  }, [availability]);

  const getAvailableTimesForDate = useCallback((date: string) => {
    if (!availability) return [];
    
    const dayAvailability = availability.availability.find(day => day.date === date);
    return dayAvailability?.timeSlots.filter(slot => slot.available) || [];
  }, [availability]);

  return {
    availability,
    loading,
    error,
    fetchAvailability,
    createBooking,
    isDateAvailable,
    getAvailableTimesForDate
  };
};