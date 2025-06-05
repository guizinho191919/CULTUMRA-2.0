
import { useState } from 'react';
import { format, isAfter, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { usePendingScheduling, PendingSchedule } from '@/hooks/usePendingScheduling';

interface DayAvailability {
  day: string;
  price: number;
}

interface SchedulingSelectorProps {
  itemId: string;
  itemName: string;
  itemType: 'destination' | 'restaurant';
  itemLocation: string;
  itemImage?: string;
  availability?: DayAvailability[];
}

// Mapeamento de dias da semana em português para números (0-6, onde 0 é domingo)
const weekdayMap: Record<string, number> = {
  'Domingo': 0,
  'Segunda': 1,
  'Terça': 2,
  'Quarta': 3,
  'Quinta': 4,
  'Sexta': 5,
  'Sábado': 6
};

const SchedulingSelector = ({ 
  itemId, 
  itemName, 
  itemType, 
  itemLocation, 
  itemImage,
  availability 
}: SchedulingSelectorProps) => {
  const { addPendingSchedule, getPendingScheduleForItem } = usePendingScheduling();
  const existingSchedule = getPendingScheduleForItem(itemId);
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(existingSchedule?.date);
  const [selectedTime, setSelectedTime] = useState<string>(existingSchedule?.time || '');
  const [isExpanded, setIsExpanded] = useState(!!existingSchedule);

  const handleSaveSchedule = () => {
    if (!selectedDate || !selectedTime) return;

    const schedule: PendingSchedule = {
      itemId,
      itemName,
      itemType,
      itemLocation,
      itemImage,
      date: selectedDate,
      time: selectedTime,
    };

    addPendingSchedule(schedule);
    setIsExpanded(false);
  };

  const hasSchedule = !!existingSchedule;

  // Função para verificar se uma data está disponível
  const isDateAvailable = (date: Date) => {
    // Se não houver informações de disponibilidade, permitir qualquer dia
    if (!availability || availability.length === 0) {
      return true;
    }

    // Obter o dia da semana (0-6, onde 0 é domingo)
    const dayOfWeek = getDay(date);
    
    // Verificar se o dia da semana está na lista de disponibilidade
    return availability.some(dayInfo => weekdayMap[dayInfo.day] === dayOfWeek);
  };

  // Função para obter o preço para uma data específica
  const getPriceForDate = (date: Date): number | null => {
    if (!availability || availability.length === 0) {
      return null;
    }

    const dayOfWeek = getDay(date);
    const dayInfo = availability.find(dayInfo => weekdayMap[dayInfo.day] === dayOfWeek);
    return dayInfo ? dayInfo.price : null;
  };

  // Componente para renderizar o dia no calendário com preço
  const renderDay = (day: Date) => {
    const price = getPriceForDate(day);
    return (
      <div className="flex flex-col items-center justify-center">
        <div>{format(day, 'd')}</div>
        {price && <div className="text-xs text-green-600">R${price}</div>}
      </div>
    );
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center space-x-2">
            <span>{itemType === 'destination' ? '📅' : '🍽️'}</span>
            <span>Agendar {itemType === 'destination' ? 'Visita' : 'Mesa'}</span>
          </CardTitle>
          {hasSchedule && !isExpanded && (
            <Badge className="bg-green-100 text-green-700">
              {format(existingSchedule.date, 'dd/MM/yyyy', { locale: ptBR })} às {existingSchedule.time}
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Fechar' : hasSchedule ? 'Alterar' : 'Agendar'}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Date Selection */}
          <div>
            <h4 className="font-medium mb-3 flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Selecione a data</span>
            </h4>
            <div className="border rounded-lg p-2">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => {
                  // Desabilitar datas passadas
                  if (!isAfter(date, new Date())) return true;
                  
                  // Desabilitar dias da semana não disponíveis
                  return !isDateAvailable(date);
                }}
                components={{
                  Day: ({ date, ...props }) => {
                    // Só renderizar dias personalizados para datas disponíveis
                    if (isDateAvailable(date)) {
                      return (
                        <div {...props}>
                          {renderDay(date)}
                        </div>
                      );
                    }
                    return <div {...props}>{format(date, 'd')}</div>;
                  },
                }}
                className="w-full"
              />
            </div>
          </div>

          {/* Time Selection */}
          <div>
            <h4 className="font-medium mb-3 flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Selecione o horário</span>
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'].map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTime(time)}
                  className="text-xs"
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <Button 
            onClick={handleSaveSchedule}
            className="w-full bg-cerrado-600 hover:bg-cerrado-700"
            disabled={!selectedDate || !selectedTime}
          >
            Salvar Agendamento
          </Button>
        </CardContent>
      )}
    </Card>
  );
};

export default SchedulingSelector;
