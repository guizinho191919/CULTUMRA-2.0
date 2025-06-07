
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Guide } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, Users } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { ptBR } from 'date-fns/locale';

interface GuideCardProps {
  guide: Guide;
  onViewProfile: (guide: Guide) => void;
  onStartChat: (guide: Guide) => void;
}

const GuideCard = ({ guide, onViewProfile, onStartChat }: GuideCardProps) => {
  const { isAuthenticated, checkPaidReservation } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showBooking, setShowBooking] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [numberOfPeople, setNumberOfPeople] = useState(1);

  // Simular disponibilidade do guia (próximos 30 dias, exceto alguns dias ocupados)
  const getAvailableDates = () => {
    const today = new Date();
    const availableDates: Date[] = [];
    const unavailableDays = [0, 6]; // Domingo e Sábado indisponíveis para alguns guias
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Simular alguns dias ocupados aleatoriamente
      const isUnavailable = Math.random() < 0.2 || unavailableDays.includes(date.getDay());
      
      if (!isUnavailable) {
        availableDates.push(date);
      }
    }
    
    return availableDates;
  };

  const availableDates = getAvailableDates();

  // Calcular total de dias e valor
  const calculateTotal = () => {
    if (!dateRange?.from || !dateRange?.to) return { days: 0, total: 0 };
    
    const timeDiff = dateRange.to.getTime() - dateRange.from.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    const total = days * hoursPerDay * guide.pricePerHour * numberOfPeople;
    
    return { days, total };
  };

  const { days, total } = calculateTotal();

  const isDateAvailable = (date: Date) => {
    return availableDates.some(availableDate => 
      availableDate.toDateString() === date.toDateString()
    );
  };

  const handleContractClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Faça login para contratar guias.",
        variant: "destructive",
      });
      return;
    }
    
    // Navegar para a mochila com informações do guia
    navigate('/backpack', { 
      state: { 
        selectedGuide: guide,
        dateRange: dateRange,
        hoursPerDay: hoursPerDay,
        numberOfPeople: numberOfPeople,
        totalPrice: total
      } 
    });
  };

  const handleChatClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Faça login para conversar com guias.",
        variant: "destructive",
      });
      return;
    }
    
    const hasPaidReservation = checkPaidReservation(guide.id);
    
    if (!hasPaidReservation) {
      toast({
        title: "Pagamento necessário",
        description: "Contrate os serviços do guia para iniciar uma conversa.",
        variant: "destructive",
      });
      return;
    }
    
    onStartChat(guide);
  };
  // Gerar foto fictícia baseada no ID do guia
  const getGuidePhoto = (id: string) => {
    const photos = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
    ];
    const index = parseInt(id) % photos.length;
    return photos[index];
  };

  // Função para obter ícone para cada especialidade (sem cores específicas)
  const getSpecialtyIcon = (specialty: string) => {
    const specialtyMap: { [key: string]: string } = {
      'centro histórico': '🏛️',
      'gastronomia local': '🍽️',
      'festas tradicionais': '🎭',
      'ecoturismo': '🌿',
      'comunidades tradicionais': '🏘️',
      'artesanato': '🎨',
      'aventura': '🏔️',
      'cultural': '🎭',
      'histórico': '🏛️',
      'gastronômico': '🍽️',
      'religioso': '⛪',
      'rural': '🌾',
      'urbano': '🏙️',
      'pantanal': '🐟',
      'observação de fauna': '🦎',
      'pesca esportiva': '🎣',
      'navegação': '⛵',
      'acampamento': '⛺',
      'trekking': '🥾',
      'rapel': '🧗',
      'cachoeiras': '💧'
    };
    
    const normalizedSpecialty = specialty.toLowerCase();
    return specialtyMap[normalizedSpecialty] || '🔍';
  };

  return (
    <Card className="group overflow-hidden card-hover cursor-pointer h-full flex flex-col">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {/* Máximo 2 badges + contador se necessário */}
        <div className="absolute top-3 left-3 flex gap-1 z-10">
          {guide.specialties.slice(0, 2).map((specialty, index) => {
            const icon = getSpecialtyIcon(specialty);
            return (
              <Badge 
                key={index} 
                className="bg-white/90 text-gray-800 border-0 text-xs flex items-center gap-1 whitespace-nowrap"
              >
                <span>{icon}</span>
                <span>{specialty}</span>
              </Badge>
            );
          })}
          {guide.specialties.length > 2 && (
            <Badge className="bg-white/90 text-gray-800 border-0 text-xs">
              +{guide.specialties.length - 2}
            </Badge>
          )}
        </div>
        
        {/* Avaliação no inferior esquerdo */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="bg-white/95 px-2 py-1 rounded-full flex items-center space-x-1 shadow-sm">
            <span className="text-yellow-500">⭐</span>
            <span className="text-sm font-medium text-gray-800">{guide.rating.toFixed(1)}</span>
          </div>
        </div>
        
        {/* Foto do guia e balão de fala */}
        <div className="absolute inset-0 flex items-center px-4">
          <div className="flex items-center w-full">
            {/* Foto de perfil circular */}
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0 z-10">
              <img
                src={getGuidePhoto(guide.id)}
                alt={guide.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
            {/* Balão de fala */}
            <div className="relative ml-3 bg-white p-3 rounded-lg shadow-sm max-w-[70%] z-0">
              <div className="absolute left-[-8px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-r-[12px] border-r-white border-b-8 border-b-transparent"></div>
              <p className="text-sm text-gray-700 italic">"{guide.description.split('.')[0]}."</p>
            </div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg group-hover:text-cerrado-600 transition-colors line-clamp-1">
            {guide.name}
          </h3>
          <span className="text-cerrado-600 font-medium text-sm">
            R$ {guide.pricePerHour}/hora
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">
          {guide.description}
        </p>
        
        {/* Nova seção de disponibilidade */}
        <div className="mb-3 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-800 flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              Disponibilidade
            </span>
            <span className="text-xs text-green-600">
              {availableDates.length} dias disponíveis
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBooking(!showBooking)}
            className="w-full text-xs border-green-300 text-green-700 hover:bg-green-100"
          >
            {showBooking ? 'Ocultar Calendário' : 'Selecionar Período'}
          </Button>
        </div>

        {/* Seção de reserva expandida com calendário centralizado */}
        {showBooking && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-green-800 flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                Disponibilidade
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBooking(false)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                ✕ Fechar
              </Button>
            </div>
            
            <div className="mb-3 text-xs text-green-600">
              {availableDates.length} dias disponíveis nos próximos 30 dias
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Selecione o período da viagem
                </label>
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  disabled={(date) => !isDateAvailable(date) || date < new Date()}
                  locale={ptBR}
                  className="rounded-md border text-xs mx-auto"
                  numberOfMonths={1}
                  weekStartsOn={0}
                  formatters={{
                    formatCaption: (date) => {
                      return new Intl.DateTimeFormat('pt-BR', {
                        month: 'long',
                        year: 'numeric'
                      }).format(date);
                    },
                    formatWeekdayName: (date) => {
                      return new Intl.DateTimeFormat('pt-BR', {
                        weekday: 'short'
                      }).format(date).replace('.', '');
                    }
                  }}
                />
              </div>
              
              {/* Seleção de quantidade de pessoas */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Quantidade de pessoas
                </label>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(Number(e.target.value))}
                    className="w-20 px-2 py-1 border rounded text-sm"
                  />
                  <span className="text-sm text-gray-600">
                    {numberOfPeople === 1 ? 'pessoa' : 'pessoas'}
                  </span>
                </div>
              </div>
              
              {dateRange?.from && dateRange?.to && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Horas por dia
                  </label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={hoursPerDay}
                      onChange={(e) => setHoursPerDay(Number(e.target.value))}
                      className="w-20 px-2 py-1 border rounded text-sm"
                    />
                    <span className="text-sm text-gray-600">horas/dia</span>
                  </div>
                </div>
              )}
              
              {dateRange?.from && dateRange?.to && (
                <div className="bg-cerrado-50 p-3 rounded-lg border border-cerrado-200">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Período:</span>
                      <span className="font-medium">
                        {dateRange.from.toLocaleDateString('pt-BR')} - {dateRange.to.toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duração:</span>
                      <span className="font-medium">{days} dias</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pessoas:</span>
                      <span className="font-medium">{numberOfPeople} {numberOfPeople === 1 ? 'pessoa' : 'pessoas'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Horas por dia:</span>
                      <span className="font-medium">{hoursPerDay}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Horas totais:</span>
                      <span className="font-medium">{days * hoursPerDay}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valor por hora (por pessoa):</span>
                      <span className="font-medium">R$ {guide.pricePerHour}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between text-lg font-bold text-cerrado-700">
                      <span>Total:</span>
                      <span>R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center">
            <span className="mr-1">🎯</span>
            {guide.experience} anos de experiência
          </span>
          <span className="flex items-center">
            <span className="mr-1">🗣️</span>
            {guide.languages.length} idiomas
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <div className="flex space-x-2 w-full">
          <Button 
            variant="outline" 
            className="flex-1 border-gray-300 text-gray-700"
            onClick={() => onViewProfile(guide)}
          >
            Ver Perfil
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-pantanal-50 hover:bg-pantanal-100 text-pantanal-700"
            onClick={checkPaidReservation(guide.id) ? handleChatClick : handleContractClick}
          >
            💬 {checkPaidReservation(guide.id) ? 'Chat' : 'Contratar'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default GuideCard;
