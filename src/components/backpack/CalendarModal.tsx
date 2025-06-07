import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface CalendarModalProps {
  isOpen: boolean;
  selectedItem: { id: string; name: string; type: 'spot' | 'restaurant' } | null;
  selectedDate: Date | undefined;
  items: any[];
  restaurantItems: any[];
  onClose: () => void;
  onDateSelect: (date: Date | undefined) => void;
  onConfirm: () => void;
  getDateInfo: (date: Date) => { isSpecial: boolean; name: string; multiplier: number };
  getBasePrice: (priceRange: string, type: 'spot' | 'restaurant') => number;
  calculatePriceForDate: (basePrice: number, date: Date) => number;
}

const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  selectedItem,
  selectedDate,
  items,
  restaurantItems,
  onClose,
  onDateSelect,
  onConfirm,
  getDateInfo,
  getBasePrice,
  calculatePriceForDate
}) => {
  if (!isOpen) return null;

  return (
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
            onClick={onClose}
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
              onSelect={onDateSelect}
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
                })()}
              </div>
            </div>
          )}
          
          {/* Botões compactos */}
          <div className="space-y-2">
            <Button 
              onClick={onConfirm}
              disabled={!selectedDate}
              className="w-full bg-gradient-to-r from-cerrado-500 to-cerrado-600 hover:from-cerrado-600 hover:to-cerrado-700 disabled:bg-gray-300 h-10 text-sm font-semibold shadow-md transition-all duration-200"
            >
              ✓ Confirmar Agendamento
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 h-10 text-sm font-medium transition-colors"
            >
              ✕ Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;