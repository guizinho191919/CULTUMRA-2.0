import { AvailabilityRequest, AvailabilityResponse, GuideAvailability, GuideScheduleSettings } from '../types/guide-availability';

class GuideAvailabilityService {
  private baseUrl = '/api/guides';

  async getAvailability(request: AvailabilityRequest): Promise<AvailabilityResponse> {
    const params = new URLSearchParams({
      startDate: request.startDate,
      endDate: request.endDate,
      duration: request.duration.toString()
    });

    const response = await fetch(`${this.baseUrl}/${request.guideId}/availability?${params}`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar disponibilidade do guia');
    }

    return response.json();
  }

  async createBooking(guideId: string, booking: {
    startDate: string;
    endDate: string;
    startTime: string;
    duration: number;
    clientId: string;
  }): Promise<{ bookingId: string; success: boolean }> {
    const response = await fetch(`${this.baseUrl}/${guideId}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(booking)
    });

    if (!response.ok) {
      throw new Error('Erro ao criar reserva');
    }

    return response.json();
  }

  async getGuideSettings(guideId: string): Promise<GuideScheduleSettings> {
    const response = await fetch(`${this.baseUrl}/${guideId}/settings`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar configurações do guia');
    }

    return response.json();
  }

  async updateGuideSettings(guideId: string, settings: Partial<GuideScheduleSettings>): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${guideId}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings)
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar configurações do guia');
    }
  }

  async blockDates(guideId: string, dates: string[], reason?: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${guideId}/block-dates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dates, reason })
    });

    if (!response.ok) {
      throw new Error('Erro ao bloquear datas');
    }
  }
}

export const guideAvailabilityService = new GuideAvailabilityService();