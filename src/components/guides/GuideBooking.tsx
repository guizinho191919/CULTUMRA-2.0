import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Guide } from '@/types';
import { Clock, MapPin, Star, Users, Sparkles } from 'lucide-react';
import CustomProposalRequest from './CustomProposalRequest';
import { DateRange } from 'react-day-picker'; // Adicionar import

interface GuideBookingProps {
  guide: Guide;
  onClose: () => void;
  travelDate?: Date;
}

const GuideBooking = ({ guide, onClose, travelDate }: GuideBookingProps) => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>();
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(4); // horas
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [showCustomProposal, setShowCustomProposal] = useState(false);

  // Simular datas disponíveis do guia (em produção viria do backend)
  useEffect(() => {
    const generateAvailableDates = () => {
      const dates = [];
      const today = new Date();
      
      // Próximos 30 dias com algumas datas disponíveis
      for (let i = 1; i <= 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        // Simular disponibilidade (segunda a sábado, exceto alguns dias)
        const dayOfWeek = date.getDay();
        if (dayOfWeek !== 0 && Math.random() > 0.3) { // 70% de chance de estar disponível
          dates.push(date);
        }
      }
      
      setAvailableDates(dates);
    };

    generateAvailableDates();
  }, []);

  // Atualizar horários disponíveis quando uma data é selecionada
  useEffect(() => {
    if (selectedDateRange?.from) {
      // Simular horários disponíveis para a data selecionada
      const times = ['08:00', '09:00', '10:00', '13:00', '14:00', '15:00'];
      const availableToday = times.filter(() => Math.random() > 0.4); // 60% de chance
      setAvailableTimes(availableToday);
    }
  }, [selectedDateRange]);

  // Usar data da viagem se fornecida
  useEffect(() => {
    if (travelDate) {
      setSelectedDateRange({ from: travelDate, to: undefined });
    }
  }, [travelDate]);

  const calculateTotal = () => {
    if (!selectedDateRange?.from || !selectedDateRange?.to) {
      return guide.pricePerHour * duration;
    }
    // Calcular total baseado no período selecionado
    const timeDiff = selectedDateRange.to.getTime() - selectedDateRange.from.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    return guide.pricePerHour * duration * days;
  };

  const handleBooking = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Faça login para contratar um guia.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (!selectedDateRange?.from || !selectedTime) {
      toast({
        title: "Dados incompletos",
        description: "Selecione o período e horário para continuar.",
        variant: "destructive",
      });
      return;
    }

    // Redirecionar para checkout com dados da contratação
    navigate('/checkout', {
      state: {
        type: 'guide',
        guideId: guide.id,
        guideName: guide.name,
        pricePerHour: guide.pricePerHour,
        selectedDateRange: {
          from: selectedDateRange.from.toISOString(),
          to: selectedDateRange.to?.toISOString()
        },
        selectedTime,
        duration,
        total: calculateTotal()
      }
    });
  };

  const isDateAvailable = (date: Date) => {
    return availableDates.some(availableDate => 
      availableDate.toDateString() === date.toDateString()
    );
  };

  // Se estiver mostrando proposta personalizada, renderizar esse componente
  if (showCustomProposal) {
    return (
      <CustomProposalRequest 
        guide={guide} 
        onClose={onClose}
        onBackToBooking={() => setShowCustomProposal(false)}
      />
    );
  }

  const handleRequestProposal = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Faça login para solicitar propostas.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    // Redirecionar para sistema de propostas
    navigate('/proposals/request', {
      state: {
        guideId: guide.id,
        guideName: guide.name,
        travelDate: selectedDateRange?.from?.toISOString()
      }
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-none">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Contratar Guia</CardTitle>
              <Button variant="ghost" onClick={onClose} className="h-8 w-8 p-0">
                ×
              </Button>
            </div>
            
            {/* Opções de contratação */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <div className="p-3 border rounded-lg bg-blue-50 border-blue-200">
                <h3 className="font-medium text-blue-900">Contratação Rápida</h3>
                <p className="text-sm text-blue-700">Escolha data, horário e duração</p>
              </div>
              
              <Button 
                variant="outline"
                onClick={() => setShowCustomProposal(true)}
                className="h-auto p-3 border-pantanal-200 hover:bg-pantanal-50"
              >
                <div className="text-left">
                  <div className="flex items-center">
                    <Sparkles className="h-4 w-4 mr-2 text-pantanal-600" />
                    <span className="font-medium text-pantanal-900">Proposta Personalizada</span>
                  </div>
                  <p className="text-sm text-pantanal-700">Roteiro sob medida para sua viagem</p>
                </div>
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informações do Guia */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-pantanal-600 flex items-center justify-center text-white text-xl font-bold">
                    {guide.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{guide.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{guide.rating}</span>
                      <span>•</span>
                      <MapPin className="h-4 w-4" />
                      <span>{guide.location}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">Especialidades</h4>
                    <div className="flex flex-wrap gap-2">
                      {guide.specialties.slice(0, 3).map((specialty, index) => (
                        <Badge key={index} variant="outline">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Idiomas</h4>
                    <div className="flex flex-wrap gap-2">
                      {guide.languages.map((language, index) => (
                        <Badge key={index} variant="outline">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Preço por hora</span>
                      <span className="text-lg font-bold text-pantanal-600">
                        R$ {guide.pricePerHour}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm font-medium">Duração (horas)</label>
                        <select 
                          value={duration} 
                          onChange={(e) => setDuration(Number(e.target.value))}
                          className="w-full mt-1 p-2 border rounded-md"
                        >
                          <option value={2}>2 horas</option>
                          <option value={4}>4 horas (meio dia)</option>
                          <option value={8}>8 horas (dia inteiro)</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="font-medium">Total</span>
                        <span className="text-xl font-bold text-pantanal-600">
                          R$ {calculateTotal()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seleção de Data e Horário */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Selecione o período da viagem</h4>
                  <Calendar
                    mode="range"  // Alterar de "single" para "range"
                    selected={selectedDateRange}
                    onSelect={setSelectedDateRange}
                    disabled={(date) => 
                      date < new Date() || !isDateAvailable(date)
                    }
                    className="rounded-md border"
                    numberOfMonths={2}  // Mostrar 2 meses para facilitar seleção
                  />
                  
                  <div className="mt-3 space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>Disponível</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                      <span>Indisponível</span>
                    </div>
                  </div>
                  
                  {/* Mostrar período selecionado */}
                  {selectedDateRange?.from && (
                    <div className="mt-3 p-2 bg-blue-50 rounded-md">
                      <p className="text-sm font-medium text-blue-900">
                        Período selecionado:
                      </p>
                      <p className="text-sm text-blue-700">
                        {selectedDateRange.from.toLocaleDateString('pt-BR')}
                        {selectedDateRange.to && ` até ${selectedDateRange.to.toLocaleDateString('pt-BR')}`}
                        {selectedDateRange.to && (
                          <span className="ml-2 font-medium">
                            ({Math.ceil((selectedDateRange.to.getTime() - selectedDateRange.from.getTime()) / (1000 * 3600 * 24)) + 1} dias)
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>

                {selectedDateRange?.from && (
                  <div>
                    <h4 className="font-medium mb-3">Horários disponíveis</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {availableTimes.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          onClick={() => setSelectedTime(time)}
                          className={selectedTime === time ? "bg-pantanal-600 hover:bg-pantanal-700" : ""}
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          {time}
                        </Button>
                      ))}
                    </div>
                    
                    {availableTimes.length === 0 && (
                      <p className="text-gray-500 text-sm">Nenhum horário disponível para esta data.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                onClick={handleBooking}
                disabled={!selectedDateRange?.from || !selectedTime}
                className="bg-pantanal-600 hover:bg-pantanal-700"
              >
                Contratar Serviço - R$ {calculateTotal()}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GuideBooking;