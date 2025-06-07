import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ShoppingCart } from 'lucide-react';

interface BackpackSummaryProps {
  total: number;
  allItemsScheduled: boolean;
  unscheduledCount: number;
  onCheckout: () => void;
  onClearBackpack: () => void;
}

const BackpackSummary: React.FC<BackpackSummaryProps> = ({
  total,
  allItemsScheduled,
  unscheduledCount,
  onCheckout,
  onClearBackpack
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Resumo da Mochila</span>
          <span className="text-2xl font-bold text-cerrado-600">
            R$ {total}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>R$ {total}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Taxa de serviço</span>
            <span>R$ 0</span>
          </div>
          <hr />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>R$ {total}</span>
          </div>
        </div>
        
        {!allItemsScheduled && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2 text-yellow-800">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">
                {unscheduledCount} {unscheduledCount === 1 ? 'item precisa' : 'itens precisam'} de data agendada
              </span>
            </div>
            <p className="text-xs text-yellow-700 mt-1">
              Agende as datas clicando no ícone de calendário de cada item.
            </p>
          </div>
        )}
        
        <Button 
          className="w-full text-lg py-6 bg-cerrado-600 hover:bg-cerrado-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={onCheckout}
          disabled={!allItemsScheduled}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {allItemsScheduled ? 'Ir para o Checkout' : 'Agende as datas para continuar'}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onClearBackpack}
          className="w-full mt-4 text-red-600 hover:text-red-700"
        >
          Limpar Mochila
        </Button>
      </CardContent>
    </Card>
  );
};

export default BackpackSummary;