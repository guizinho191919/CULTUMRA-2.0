
import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Clock, MapPin, Trash2 } from 'lucide-react';
import { useScheduling } from '@/hooks/useScheduling';
import { useToast } from '@/hooks/use-toast';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { scheduledEvents, removeScheduledEvent } = useScheduling();
  const { toast } = useToast();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const getEventsForDate = (date: Date) => {
    return scheduledEvents.filter(event => {
      const eventDate = new Date(event.date);
      return format(eventDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    });
  };

  const getDayEvents = (date: Date) => {
    const dayEvents = getEventsForDate(date);
    return dayEvents.slice(0, 2);
  };

  const handleRemoveEvent = (eventId: string, eventTitle: string) => {
    removeScheduledEvent(eventId);
    toast({
      title: "Removido",
      description: `${eventTitle} foi removido do calendário`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold gradient-text mb-2">📅 Meu Calendário</h1>
          <p className="text-gray-600">
            Seus destinos e experiências gastronômicas agendadas
          </p>
        </div>

        {/* Calendar Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={prevMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <CardTitle className="text-xl">
                {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
              </CardTitle>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {monthDays.map(day => {
                const dayEvents = getDayEvents(day);
                const isSelected = selectedDate && format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                
                return (
                  <div 
                    key={day.toString()}
                    className={`min-h-[80px] p-1 border rounded-lg cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-cerrado-50 border-cerrado-200' 
                        : 'hover:bg-gray-50 border-gray-200'
                    } ${isToday(day) ? 'bg-blue-50 border-blue-200' : ''}`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className={`text-sm font-medium ${
                      !isSameMonth(day, currentDate) 
                        ? 'text-gray-400' 
                        : isToday(day) 
                          ? 'text-blue-600' 
                          : 'text-gray-900'
                    }`}>
                      {format(day, 'd')}
                    </div>
                    
                    <div className="space-y-1 mt-1">
                      {dayEvents.map(event => (
                        <div 
                          key={event.id}
                          className={`text-xs p-1 rounded border ${event.color} truncate`}
                        >
                          {event.time} - {event.title}
                        </div>
                      ))}
                      {getEventsForDate(day).length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{getEventsForDate(day).length - 2} mais
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Event Details */}
        {selectedDate && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📋</span>
                <span>Eventos - {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getEventsForDate(selectedDate).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📅</div>
                  <p>Nenhum evento agendado para esta data</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getEventsForDate(selectedDate).map(event => (
                    <div key={event.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {event.image ? (
                          <img 
                            src={event.image} 
                            alt={event.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            event.type === 'destination' ? 'bg-green-100' : 'bg-blue-100'
                          }`}>
                            <span>{event.type === 'destination' ? '🗺️' : '🍽️'}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <Badge 
                          className={`mt-2 ${
                            event.type === 'destination' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {event.type === 'destination' ? 'Destino' : 'Restaurante'}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveEvent(event.id, event.title)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      <Navigation />
    </div>
  );
};

export default Calendar;
