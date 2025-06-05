
import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useBackpack } from '@/hooks/useBackpack';
import { Trash2, ShoppingCart, Calendar, Clock } from 'lucide-react';

interface ScheduledItem {
  id: string;
  date: Date;
  price: number;
}

const Backpack = () => {
  const { items, restaurantItems, removeFromBackpack, removeRestaurantFromBackpack, clearBackpack, getTotalItems } = useBackpack();
  const navigate = useNavigate();
  const [scheduledSpots, setScheduledSpots] = useState<ScheduledItem[]>([]);
  const [scheduledRestaurants, setScheduledRestaurants] = useState<ScheduledItem[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{id: string, name: string, type: 'spot' | 'restaurant'} | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Datas comemorativas com preços especiais
  const specialDates = {
    '2024-12-25': { multiplier: 2.0, name: 'Natal' },
    '2024-12-31': { multiplier: 2.5, name: 'Réveillon' },
    '2024-01-01': { multiplier: 2.5, name: 'Ano Novo' },
    '2024-02-13': { multiplier: 1.8, name: 'Carnaval' },
    '2024-06-24': { multiplier: 1.5, name: 'São João' },
    '2024-10-12': { multiplier: 1.3, name: 'Nossa Senhora Aparecida' },
    '2024-09-07': { multiplier: 1.2, name: 'Independência' },
  };

  // Função para calcular preço baseado na data
  const calculatePriceForDate = (basePrice: number, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const specialDate = specialDates[dateStr as keyof typeof specialDates];
    
    if (specialDate) {
      return Math.round(basePrice * specialDate.multiplier);
    }
    
    // Preços de fim de semana (20% mais caro)
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return Math.round(basePrice * 1.2);
    }
    
    return basePrice;
  };

  // Função para obter o preço base
  const getBasePrice = (priceRange: string, type: 'spot' | 'restaurant') => {
    const spotPrices = { '$': 25, '$$': 65, '$$$': 125, '$$$$': 250 };
    const restaurantPrices = { '$': 30, '$$': 80, '$$$': 150, '$$$$': 300 };
    
    const prices = type === 'spot' ? spotPrices : restaurantPrices;
    return prices[priceRange as keyof typeof prices] || (type === 'spot' ? 50 : 60);
  };

  // Função para verificar se todos os itens têm data agendada
  const allItemsScheduled = () => {
    const spotsScheduled = items.every(item => 
      scheduledSpots.some(scheduled => scheduled.id === item.spot.id)
    );
    const restaurantsScheduled = restaurantItems.every(item => 
      scheduledRestaurants.some(scheduled => scheduled.id === item.restaurant.id)
    );
    return spotsScheduled && restaurantsScheduled;
  };

  // Função para contar itens não agendados
  const getUnscheduledCount = () => {
    const unscheduledSpots = items.filter(item => 
      !scheduledSpots.some(scheduled => scheduled.id === item.spot.id)
    ).length;
    const unscheduledRestaurants = restaurantItems.filter(item => 
      !scheduledRestaurants.some(scheduled => scheduled.id === item.restaurant.id)
    ).length;
    return unscheduledSpots + unscheduledRestaurants;
  };

  // Função para abrir o calendário
  const openCalendar = (id: string, name: string, type: 'spot' | 'restaurant') => {
    setSelectedItem({ id, name, type });
    setIsCalendarOpen(true);
    setSelectedDate(undefined);
  };

  // Função para confirmar agendamento
  function confirmScheduling() {
    if (!selectedDate || !selectedItem) {
      console.log('Dados insuficientes:', { selectedDate, selectedItem });
      return;
    }

    const item = selectedItem.type === 'spot' 
      ? items.find(i => i.spot.id === selectedItem.id)
      : restaurantItems.find(i => i.restaurant.id === selectedItem.id);
    
    if (!item) {
      console.log('Item não encontrado:', selectedItem);
      return;
    }

    // Correção: acesso direto ao priceRange baseado no tipo
    const priceRange = selectedItem.type === 'spot' 
      ? ('spot' in item ? item.spot.priceRange : '$')
      : ('restaurant' in item ? item.restaurant.priceRange : '$');
    
    const basePrice = getBasePrice(priceRange, selectedItem.type);
    const finalPrice = calculatePriceForDate(basePrice, selectedDate);

    const scheduledItem: ScheduledItem = {
      id: selectedItem.id,
      date: selectedDate,
      price: finalPrice
    };

    // Atualizar os estados primeiro
    if (selectedItem.type === 'spot') {
      setScheduledSpots(prev => [
        ...prev.filter(s => s.id !== selectedItem.id),
        scheduledItem
      ]);
    } else {
      setScheduledRestaurants(prev => [
        ...prev.filter(s => s.id !== selectedItem.id),
        scheduledItem
      ]);
    }
    
    // Fechar o modal e limpar os estados
    setIsCalendarOpen(false);
    setSelectedItem(null);
    setSelectedDate(undefined);
  }

  // Função para obter informações de agendamento
  const getSchedulingInfo = (id: string, type: 'spot' | 'restaurant') => {
    const scheduled = type === 'spot' 
      ? scheduledSpots.find(s => s.id === id)
      : scheduledRestaurants.find(s => s.id === id);
    return scheduled;
  };

  // Função para calcular total com datas agendadas
  const calculateTotal = () => {
    const spotsTotal = items.reduce((total, item) => {
      const scheduled = getSchedulingInfo(item.spot.id, 'spot');
      if (scheduled) {
        return total + scheduled.price;
      }
      const basePrice = getBasePrice(item.spot.priceRange, 'spot');
      return total + basePrice;
    }, 0);
    
    const restaurantsTotal = restaurantItems.reduce((total, item) => {
      const scheduled = getSchedulingInfo(item.restaurant.id, 'restaurant');
      if (scheduled) {
        return total + scheduled.price;
      }
      const basePrice = getBasePrice(item.restaurant.priceRange, 'restaurant');
      return total + basePrice;
    }, 0);
    
    return spotsTotal + restaurantsTotal;
  };

  // Função para verificar se uma data é especial
  const getDateInfo = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const specialDate = specialDates[dateStr as keyof typeof specialDates];
    
    if (specialDate) {
      return { isSpecial: true, name: specialDate.name, multiplier: specialDate.multiplier };
    }
    
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return { isSpecial: true, name: 'Fim de semana', multiplier: 1.2 };
    }
    
    return { isSpecial: false, name: '', multiplier: 1.0 };
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0 && restaurantItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6 pb-20">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🎒</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sua mochila está vazia
              </h3>
              <p className="text-gray-600 mb-4">
                Adicione destinos e experiências para planejar sua viagem.
              </p>
              <Link to="/explore">
                <Button>Explorar Destinos</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        {/* Botão de Voltar */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          ← Voltar
        </Button>
        
        {/* Header da Mochila */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold gradient-text flex items-center space-x-2">
              <span>🎒</span>
              <span>Minha Mochila</span>
            </h1>
            <p className="text-gray-600">
              {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'itens'} adicionados
            </p>
          </div>
          {/* Botão "Limpar Mochila" removido daqui */}
        </div>

        {/* Lista de Pontos Turísticos */}
        {items.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 text-cerrado-700">🗺️ Pontos Turísticos</h2>
            <div className="space-y-4">
              {items.map((item) => {
                const basePrice = getBasePrice(item.spot.priceRange, 'spot');
                const schedulingInfo = getSchedulingInfo(item.spot.id, 'spot');
                const displayPrice = schedulingInfo ? schedulingInfo.price : basePrice;

                return (
                  <Card key={item.spot.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-cerrado-200 to-pantanal-200 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">🗺️</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{item.spot.name}</h3>
                          <p className="text-gray-600 text-sm line-clamp-2">{item.spot.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge className="bg-cerrado-100 text-cerrado-700">
                              {item.spot.categories[0] || 'Geral'}
                            </Badge>
                            <Badge variant="outline">
                              {item.spot.location.city}
                            </Badge>
                          </div>
                          {schedulingInfo && (
                            <div className="mt-2 flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-cerrado-600" />
                              <span className="text-sm text-cerrado-600">
                                {format(schedulingInfo.date, 'dd/MM/yyyy', { locale: ptBR })}
                              </span>
                              {getDateInfo(schedulingInfo.date).isSpecial && (
                                <Badge variant="secondary" className="text-xs">
                                  {getDateInfo(schedulingInfo.date).name}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-right space-y-2">
                          <div className="text-lg font-bold text-cerrado-600">
                            R$ {displayPrice}
                            {schedulingInfo && displayPrice !== basePrice && (
                              <div className="text-xs text-gray-500 line-through">
                                R$ {basePrice}
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openCalendar(item.spot.id, item.spot.name, 'spot')}
                              className="text-cerrado-600 hover:text-cerrado-700"
                            >
                              <Calendar className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFromBackpack(item.spot.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Lista de Restaurantes */}
        {restaurantItems.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 text-cerrado-700">🍽️ Restaurantes</h2>
            <div className="space-y-4">
              {restaurantItems.map((item) => {
                const basePrice = getBasePrice(item.restaurant.priceRange, 'restaurant');
                const schedulingInfo = getSchedulingInfo(item.restaurant.id, 'restaurant');
                const displayPrice = schedulingInfo ? schedulingInfo.price : basePrice;

                return (
                  <Card key={item.restaurant.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-200 to-red-200 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">🍽️</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{item.restaurant.name}</h3>
                          <p className="text-gray-600 text-sm line-clamp-2">{item.restaurant.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge className="bg-orange-100 text-orange-700">
                              {item.restaurant.cuisine}
                            </Badge>
                            <Badge variant="outline">
                              {item.restaurant.location.city}
                            </Badge>
                          </div>
                          {schedulingInfo && (
                            <div className="mt-2 flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-cerrado-600" />
                              <span className="text-sm text-cerrado-600">
                                {format(schedulingInfo.date, 'dd/MM/yyyy', { locale: ptBR })}
                              </span>
                              {getDateInfo(schedulingInfo.date).isSpecial && (
                                <Badge variant="secondary" className="text-xs">
                                  {getDateInfo(schedulingInfo.date).name}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-right space-y-2">
                          <div className="text-lg font-bold text-cerrado-600">
                            R$ {displayPrice}
                            {schedulingInfo && displayPrice !== basePrice && (
                              <div className="text-xs text-gray-500 line-through">
                                R$ {basePrice}
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openCalendar(item.restaurant.id, item.restaurant.name, 'restaurant')}
                              className="text-cerrado-600 hover:text-cerrado-700"
                            >
                              <Calendar className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeRestaurantFromBackpack(item.restaurant.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Resumo e Checkout */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Resumo da Mochila</span>
              <span className="text-2xl font-bold text-cerrado-600">
                R$ {calculateTotal()}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>R$ {calculateTotal()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Taxa de serviço</span>
                <span>R$ 0</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>R$ {calculateTotal()}</span>
              </div>
            </div>
            
            {/* Aviso se nem todos os itens estão agendados */}
            {!allItemsScheduled() && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2 text-yellow-800">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {getUnscheduledCount()} {getUnscheduledCount() === 1 ? 'item precisa' : 'itens precisam'} de data agendada
                  </span>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  Agende as datas clicando no ícone de calendário de cada item.
                </p>
              </div>
            )}
            
            <Button 
              className="w-full text-lg py-6 bg-cerrado-600 hover:bg-cerrado-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={handleCheckout}
              disabled={!allItemsScheduled()}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {allItemsScheduled() ? 'Ir para o Checkout' : 'Agende as datas para continuar'}
            </Button>
            
            {/* Botão "Limpar Mochila" movido para baixo */}
            <Button 
              variant="outline" 
              onClick={clearBackpack}
              className="w-full mt-4 text-red-600 hover:text-red-700"
            >
              Limpar Mochila
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Modal do Calendário (versão otimizada para caber na tela) */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-[380px] max-h-[90vh] overflow-y-auto">
            {/* Header compacto */}
            <div className="bg-gradient-to-r from-cerrado-500 to-cerrado-600 p-3 flex justify-between items-center rounded-t-lg">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white">
                  {selectedItem?.type === 'spot' ? '📍' : '🍽️'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Visita
                  </h3>
                  <p className="text-xs text-cerrado-100 truncate max-w-[200px]">{selectedItem?.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCalendarOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white hover:bg-white hover:bg-opacity-20 transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Calendário compacto */}
            <div className="p-3">
              <div className="mb-3">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="w-full"
                  locale={ptBR}
                  classNames={{
                    months: "flex flex-col space-y-2",
                    month: "space-y-1",
                    caption: "flex justify-center pt-1 relative items-center mb-2",
                    caption_label: "text-sm font-semibold",
                    nav: "space-x-1 flex items-center",
                    nav_button: "h-7 w-7 bg-transparent hover:bg-gray-100 rounded-full transition-colors",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse",
                    head_row: "flex",
                    head_cell: "text-gray-600 w-10 font-medium text-xs flex-1 text-center py-1",
                    row: "flex w-full mt-0.5",
                    cell: "relative p-0 text-center focus-within:relative focus-within:z-20 flex-1",
                    day: "h-10 w-10 p-0 font-normal hover:bg-gray-100 rounded-md flex flex-col items-center justify-center mx-auto transition-colors",
                    day_selected: "bg-cerrado-500 text-white hover:bg-cerrado-600",
                    day_today: "font-bold border border-cerrado-300",
                    day_outside: "text-gray-300 opacity-50",
                    day_disabled: "text-gray-300 opacity-30",
                  }}
                  components={{
                    DayContent: ({ date }) => {
                      const dateInfo = getDateInfo(date);
                      const item = selectedItem?.type === 'spot' 
                        ? items.find(i => i.spot.id === selectedItem.id)
                        : restaurantItems.find(i => i.restaurant.id === selectedItem.id);
                      
                      if (!item) return <span className="text-xs">{date.getDate()}</span>;
                      
                      const priceRange = selectedItem?.type === 'spot' 
                        ? ('spot' in item ? item.spot.priceRange : '$')
                        : ('restaurant' in item ? item.restaurant.priceRange : '$');
                      
                      const basePrice = getBasePrice(priceRange, selectedItem.type);
                      const finalPrice = calculatePriceForDate(basePrice, date);
                      
                      const isSpecialDay = dateInfo.isSpecial;
                      
                      return (
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-xs font-medium">{date.getDate()}</span>
                          <span className="text-[9px] text-green-600 font-semibold bg-green-50 px-0.5 rounded">
                            R${finalPrice}
                          </span>
                        </div>
                      );
                    }
                  }}
                />
              </div>
              
              {/* Informações da data selecionada compactas */}
              {selectedDate && (
                <div className="bg-gradient-to-r from-cerrado-50 to-cerrado-100 rounded-md p-3 mb-3 border border-cerrado-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">📅</span>
                      <span className="text-xs font-semibold text-cerrado-800">
                        {format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    
                    {(() => {
                      const dateInfo = getDateInfo(selectedDate);
                      const item = selectedItem?.type === 'spot' 
                        ? items.find(i => i.spot.id === selectedItem.id)
                        : restaurantItems.find(i => i.restaurant.id === selectedItem.id);
                      
                      if (!item) return null;
                      
                      const priceRange = selectedItem?.type === 'spot' 
                        ? ('spot' in item ? item.spot.priceRange : '$')
                        : ('restaurant' in item ? item.restaurant.priceRange : '$');
                      
                      const basePrice = getBasePrice(priceRange, selectedItem.type);
                      const finalPrice = calculatePriceForDate(basePrice, selectedDate);
                      
                      return (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">💰</span>
                          <span className="text-sm font-bold text-cerrado-700">
                            R$ {finalPrice}
                          </span>
                        </div>
                      );
                    })()
                    }
                  </div>
                </div>
              )}
              
              {/* Botões compactos */}
              <div className="space-y-2">
                <Button 
                  onClick={confirmScheduling}
                  disabled={!selectedDate}
                  className="w-full bg-gradient-to-r from-cerrado-500 to-cerrado-600 hover:from-cerrado-600 hover:to-cerrado-700 disabled:bg-gray-300 h-10 text-sm font-semibold shadow-md transition-all duration-200"
                >
                  ✓ Confirmar Agendamento
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCalendarOpen(false)}
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 h-10 text-sm font-medium transition-colors"
                >
                  ✕ Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Navigation />
    </div>
  );
};

export default Backpack;
