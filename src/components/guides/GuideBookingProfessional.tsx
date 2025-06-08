import React, { useState, useEffect, useCallback } from 'react';
import { DayPicker } from 'react-day-picker';
import { DateRange } from 'react-day-picker';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Clock, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { useGuideAvailability } from '../../hooks/useGuideAvailability';
import { Guide } from '../../types';
import { format, addDays, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GuideBookingProfessionalProps {
  guide: Guide;
  onBookingComplete: (bookingData: any) => void;
  travelDate?: Date;
}

export const GuideBookingProfessional: React.FC<GuideBookingProfessionalProps> = ({
  guide,
  onBookingComplete,
  travelDate
}) => {
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [duration, setDuration] = useState<number>(4);
  const [bookingStep, setBookingStep] = useState<'dates' | 'times' | 'confirm'>('dates');
  
  const {
    availability,
    loading,
    error,
    fetchAvailability,
    createBooking,
    isDateAvailable,
    getAvailableTimesForDate
  } = useGuideAvailability(guide.id);

  // Buscar disponibilidade quando componente monta ou parâmetros mudam
  useEffect(() => {
    const startDate = travelDate || new Date();
    const endDate = addDays(startDate, 30);
    
    fetchAvailability({
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      duration
    });
  }, [fetchAvailability, duration, travelDate]);

  // Definir data inicial se fornecida
  useEffect(() => {
    if (travelDate) {
      setSelectedDateRange({ from: travelDate, to: undefined });
    }
  }, [travelDate]);

  const handleDateSelect = (range: DateRange | undefined) => {
    setSelectedDateRange(range);
    setSelectedTime('');
    
    if (range?.from && range?.to) {
      setBookingStep('times');
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setBookingStep('confirm');
  };

  const handleConfirmBooking = async () => {
    if (!selectedDateRange?.from || !selectedDateRange?.to || !selectedTime) {
      return;
    }

    try {
      const result = await createBooking({
        startDate: format(selectedDateRange.from, 'yyyy-MM-dd'),
        endDate: format(selectedDateRange.to, 'yyyy-MM-dd'),
        startTime: selectedTime,
        duration,
        clientId: 'current-user-id' // Pegar do contexto de autenticação
      });

      if (result.success) {
        onBookingComplete({
          bookingId: result.bookingId,
          guide,
          dateRange: selectedDateRange,
          time: selectedTime,
          duration,
          totalPrice: calculateTotal()
        });
      }
    } catch (err) {
      console.error('Erro ao confirmar reserva:', err);
    }
  };

  const calculateTotal = (): number => {
    if (!selectedDateRange?.from || !selectedDateRange?.to) {
      return guide.pricePerHour * duration;
    }
    
    const days = differenceInDays(selectedDateRange.to, selectedDateRange.from) + 1;
    return guide.pricePerHour * duration * days;
  };

  const getAvailableTimesForSelectedDate = () => {
    if (!selectedDateRange?.from) return [];
    
    const dateStr = format(selectedDateRange.from, 'yyyy-MM-dd');
    return getAvailableTimesForDate(dateStr);
  };

  const disabledDays = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const isPast = date < new Date();
    const isUnavailable = !isDateAvailable(dateStr);
    
    return isPast || isUnavailable;
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Carregando disponibilidade...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center text-red-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Seleção de Duração */}
      <Card>
        <CardHeader>
          <CardTitle>Duração do Serviço</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {[2, 4, 8].map((hours) => (
              <Button
                key={hours}
                variant={duration === hours ? 'default' : 'outline'}
                onClick={() => setDuration(hours)}
                className="h-12"
              >
                {hours}h
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Seleção de Período */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Selecione o Período
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DayPicker
            mode="range"
            selected={selectedDateRange}
            onSelect={handleDateSelect}
            disabled={disabledDays}
            locale={ptBR}
            className="rounded-md border"
          />
          
          {selectedDateRange?.from && selectedDateRange?.to && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">
                Período selecionado:
              </p>
              <p className="text-blue-700">
                {format(selectedDateRange.from, 'dd/MM/yyyy', { locale: ptBR })} até{' '}
                {format(selectedDateRange.to, 'dd/MM/yyyy', { locale: ptBR })}
              </p>
              <p className="text-sm text-blue-600">
                {differenceInDays(selectedDateRange.to, selectedDateRange.from) + 1} dia(s)
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Seleção de Horário */}
      {bookingStep === 'times' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Horários Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {getAvailableTimesForSelectedDate().map((timeSlot) => (
                <Button
                  key={timeSlot.start}
                  variant={selectedTime === timeSlot.start ? 'default' : 'outline'}
                  onClick={() => handleTimeSelect(timeSlot.start)}
                  className="h-12"
                >
                  {timeSlot.start}
                </Button>
              ))}
            </div>
            
            {getAvailableTimesForSelectedDate().length === 0 && (
              <p className="text-center text-gray-500 py-4">
                Nenhum horário disponível para este período
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Confirmação */}
      {bookingStep === 'confirm' && (
        <Card>
          <CardHeader>
            <CardTitle>Confirmar Reserva</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Guia:</span>
                <span className="font-medium">{guide.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Período:</span>
                <span className="font-medium">
                  {selectedDateRange?.from && selectedDateRange?.to &&
                    `${format(selectedDateRange.from, 'dd/MM', { locale: ptBR })} - ${format(selectedDateRange.to, 'dd/MM', { locale: ptBR })}`
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span>Horário:</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span>Duração:</span>
                <span className="font-medium">{duration}h por dia</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>R$ {calculateTotal().toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setBookingStep('dates')}
                className="flex-1"
              >
                Voltar
              </Button>
              <Button
                onClick={handleConfirmBooking}
                className="flex-1"
              >
                Confirmar Reserva
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informações do Guia */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <img
              src={guide.avatarUrl || '/default-avatar.png'}
              alt={guide.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium">{guide.name}</h3>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{guide.rating} ⭐</Badge>
                <span className="text-sm text-gray-600">
                  R$ {guide.pricePerHour}/hora
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};