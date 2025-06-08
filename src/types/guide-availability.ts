export interface GuideAvailability {
  id: string;
  guideId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  status: 'available' | 'booked' | 'blocked';
  bookingId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
  bookingId?: string;
}

export interface DayAvailability {
  date: string;
  timeSlots: TimeSlot[];
  isAvailable: boolean;
}

export interface AvailabilityRequest {
  guideId: string;
  startDate: string;
  endDate: string;
  duration: number; // em horas
}

export interface AvailabilityResponse {
  guideId: string;
  availability: DayAvailability[];
  workingHours: {
    start: string;
    end: string;
  };
  blockedDates: string[];
}

export interface GuideScheduleSettings {
  guideId: string;
  workingDays: number[]; // 0-6 (domingo a sábado)
  workingHours: {
    start: string;
    end: string;
  };
  minimumAdvanceHours: number;
  maximumAdvanceDays: number;
  breakBetweenBookings: number; // minutos
  minimumBookingDuration: number; // horas
  maximumBookingDuration: number; // horas
}