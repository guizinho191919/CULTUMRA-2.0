
import { Card, CardContent } from '@/components/ui/card';
import { Backpack, ShoppingCart, Trash2, Calendar } from 'lucide-react';

interface BackpackStatsProps {
  backpacks: any[];
}

const BackpackStats = ({ backpacks }: BackpackStatsProps) => {
  const activeCount = backpacks.filter(b => b.status === 'active').length;
  const completedCount = backpacks.filter(b => b.status === 'completed').length;
  const abandonedCount = backpacks.filter(b => b.status === 'abandoned').length;
  const totalValue = backpacks.reduce((sum, b) => sum + b.totalValue, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Backpack className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Mochilas Ativas</p>
              <p className="text-2xl font-bold">{activeCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Finalizadas</p>
              <p className="text-2xl font-bold">{completedCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Trash2 className="h-8 w-8 text-red-600" />
            <div>
              <p className="text-sm text-gray-600">Abandonadas</p>
              <p className="text-2xl font-bold">{abandonedCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Calendar className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold">R$ {totalValue.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackpackStats;
