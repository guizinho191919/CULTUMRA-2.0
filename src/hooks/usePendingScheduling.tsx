
import { useState, useEffect } from 'react';

export interface PendingSchedule {
  itemId: string;
  itemName: string;
  itemType: 'destination' | 'restaurant';
  itemLocation: string;
  itemImage?: string;
  date: Date;
  endDate?: Date; // Nova propriedade para data de fim
  time: string;
}

export const usePendingScheduling = () => {
  const [pendingSchedules, setPendingSchedules] = useState<PendingSchedule[]>(() => {
    try {
      const stored = localStorage.getItem('pendingSchedules');
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      return parsed.map((schedule: any) => ({
        ...schedule,
        date: new Date(schedule.date),
        endDate: schedule.endDate ? new Date(schedule.endDate) : undefined // Suporte para endDate
      }));
    } catch (error) {
      console.error('Error parsing pending schedules from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      const schedulesToStore = pendingSchedules.map(schedule => ({
        ...schedule,
        date: schedule.date.toISOString(),
        endDate: schedule.endDate ? schedule.endDate.toISOString() : undefined // Suporte para endDate
      }));
      localStorage.setItem('pendingSchedules', JSON.stringify(schedulesToStore));
    } catch (error) {
      console.error('Error saving pending schedules to localStorage:', error);
    }
  }, [pendingSchedules]);

  const addPendingSchedule = (schedule: PendingSchedule) => {
    setPendingSchedules(current => {
      // Remove existing schedule for the same item if any
      const filtered = current.filter(s => s.itemId !== schedule.itemId);
      return [...filtered, schedule];
    });
  };

  const removePendingSchedule = (itemId: string) => {
    setPendingSchedules(current => current.filter(s => s.itemId !== itemId));
  };

  const getPendingScheduleForItem = (itemId: string) => {
    return pendingSchedules.find(s => s.itemId === itemId);
  };

  const clearPendingSchedules = () => {
    setPendingSchedules([]);
  };

  const confirmPendingSchedules = (confirmedItemIds: string[]) => {
    const { useScheduling } = require('./useScheduling');
    const { addScheduledEvent } = useScheduling();

    const schedulesToConfirm = pendingSchedules.filter(schedule => 
      confirmedItemIds.includes(schedule.itemId)
    );

    schedulesToConfirm.forEach(schedule => {
      addScheduledEvent({
        type: schedule.itemType,
        itemId: schedule.itemId,
        title: schedule.itemName,
        location: schedule.itemLocation,
        date: schedule.date,
        time: schedule.time,
        color: schedule.itemType === 'destination' 
          ? 'bg-green-100 border-green-300 text-green-700' 
          : 'bg-blue-100 border-blue-300 text-blue-700',
        image: schedule.itemImage,
      });
    });

    // Remove confirmed schedules from pending
    setPendingSchedules(current => 
      current.filter(schedule => !confirmedItemIds.includes(schedule.itemId))
    );
  };

  return {
    pendingSchedules,
    addPendingSchedule,
    removePendingSchedule,
    getPendingScheduleForItem,
    clearPendingSchedules,
    confirmPendingSchedules,
  };
};
