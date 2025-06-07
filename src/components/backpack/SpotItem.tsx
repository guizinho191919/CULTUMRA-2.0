import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trash2 } from 'lucide-react';
import { ScheduledItem } from '@/hooks/useBackpackScheduling';

interface SpotItemProps {
  item: any;
  basePrice: number;
  schedulingInfo: ScheduledItem | undefined;
  displayPrice: number;
  onOpenCalendar: (id: string, name: string, type: 'spot' | 'restaurant') => void;
  onRemove: (id: string) => void;
  getDateInfo: (date: Date) => { isSpecial: boolean; name: string; multiplier: number };
}

const SpotItem: React.FC<SpotItemProps> = ({
  item,
  basePrice,
  schedulingInfo,
  displayPrice,
  onOpenCalendar,
  onRemove,
  getDateInfo
}) => {
  return (
    <Card>
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
                onClick={() => onOpenCalendar(item.spot.id, item.spot.name, 'spot')}
                className="text-cerrado-600 hover:text-cerrado-700"
              >
                <Calendar className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemove(item.spot.id)}
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
};

export default SpotItem;