
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { useBackpack } from '@/hooks/useBackpack';
import { useBackpackScheduling } from '@/hooks/useBackpackScheduling';
import EmptyBackpack from '@/components/backpack/EmptyBackpack';
import SpotItem from '@/components/backpack/SpotItem';
import RestaurantItem from '@/components/backpack/RestaurantItem';
import BackpackSummary from '@/components/backpack/BackpackSummary';
import CalendarModal from '@/components/backpack/CalendarModal';

const Backpack = () => {
  const { 
    items, 
    restaurantItems, 
    removeFromBackpack, 
    removeRestaurantFromBackpack, 
    clearBackpack, 
    getTotalItems 
  } = useBackpack();
  
  const {
    scheduledSpots,
    scheduledRestaurants,
    isCalendarOpen,
    selectedItem,
    selectedDate,
    setIsCalendarOpen,
    setSelectedDate,
    getBasePrice,
    getDateInfo,
    getSchedulingInfo,
    openCalendar,
    confirmScheduling,
    calculatePriceForDate
  } = useBackpackScheduling();
  
  const navigate = useNavigate();

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

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleConfirmScheduling = () => {
    confirmScheduling(items, restaurantItems);
  };

  if (items.length === 0 && restaurantItems.length === 0) {
    return <EmptyBackpack />;
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
                  <SpotItem
                    key={item.spot.id}
                    item={item}
                    basePrice={basePrice}
                    schedulingInfo={schedulingInfo}
                    displayPrice={displayPrice}
                    onOpenCalendar={openCalendar}
                    onRemove={removeFromBackpack}
                    getDateInfo={getDateInfo}
                  />
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
                  <RestaurantItem
                    key={item.restaurant.id}
                    item={item}
                    basePrice={basePrice}
                    schedulingInfo={schedulingInfo}
                    displayPrice={displayPrice}
                    onOpenCalendar={openCalendar}
                    onRemove={removeRestaurantFromBackpack}
                    getDateInfo={getDateInfo}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Resumo e Checkout */}
        <BackpackSummary
          total={calculateTotal()}
          allItemsScheduled={allItemsScheduled()}
          unscheduledCount={getUnscheduledCount()}
          onCheckout={handleCheckout}
          onClearBackpack={clearBackpack}
        />
      </main>

      {/* Modal do Calendário */}
      <CalendarModal
        isOpen={isCalendarOpen}
        selectedItem={selectedItem}
        selectedDate={selectedDate}
        items={items}
        restaurantItems={restaurantItems}
        onClose={() => setIsCalendarOpen(false)}
        onDateSelect={setSelectedDate}
        onConfirm={handleConfirmScheduling}
        getDateInfo={getDateInfo}
        getBasePrice={getBasePrice}
        calculatePriceForDate={calculatePriceForDate}
      />
      
      <Navigation />
    </div>
  );
};

export default Backpack;
