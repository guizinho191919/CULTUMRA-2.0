
import { useState } from 'react';
import { format, isAfter, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useScheduling } from '@/hooks/useScheduling';

interface SchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    name: string;
    location: string;
    image?: string;
    availability?: string[]; // Dias da semana disponíveis
  };
  type: 'destination' | 'restaurant';
}

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

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

const SchedulingModal = ({ isOpen, onClose, item, type }: SchedulingModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const { addScheduledEvent } = useScheduling();
  const { toast } = useToast();

  // Função para verificar se uma data está disponível
  const isDateAvailable = (date: Date) => {
    // Se não houver informações de disponibilidade, permitir qualquer dia
    if (!item.availability || item.availability.length === 0) {
      return true;
    }

    // Obter o dia da semana (0-6, onde 0 é domingo)
    const dayOfWeek = getDay(date);
    
    // Verificar se o dia da semana está na lista de disponibilidade
    return item.availability.some(day => weekdayMap[day] === dayOfWeek);
  };

  const handleSchedule = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Erro",
        description: "Selecione uma data e horário",
        variant: "destructive",
      });
      return;
    }

    const scheduledDate = new Date(selectedDate);
    scheduledDate.setHours(parseInt(selectedTime.split(':')[0]), parseInt(selectedTime.split(':')[1]));

    addScheduledEvent({
      type,
      itemId: item.id,
      title: item.name,
      location: item.location,
      date: scheduledDate,
      time: selectedTime,
      color: type === 'destination' ? 'bg-green-100 border-green-300 text-green-700' : 'bg-blue-100 border-blue-300 text-blue-700',
      image: item.image,
    });

    toast({
      title: "Agendado!",
      description: `${item.name} foi agendado para ${format(scheduledDate, 'dd/MM/yyyy', { locale: ptBR })} às ${selectedTime}`,
    });

    setSelectedDate(undefined);
    setSelectedTime('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>{type === 'destination' ? '🗺️' : '🍽️'}</span>
            <span>Agendar {item.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Item Preview */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-500">{item.location}</p>
                </div>
              </div>
            </CardContent>
          </Card>

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
              {timeSlots.map((time) => (
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

          {/* Confirmation */}
          {selectedDate && selectedTime && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-green-800">Confirmação</p>
                    <p className="text-sm text-green-600">
                      {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })} às {selectedTime}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">
                    {type === 'destination' ? 'Destino' : 'Restaurante'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button 
              onClick={handleSchedule} 
              className="flex-1 bg-cerrado-600 hover:bg-cerrado-700"
              disabled={!selectedDate || !selectedTime}
            >
              Agendar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SchedulingModal;
