
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Eye, Trash2, Calendar, MapPin, Users, DollarSign } from 'lucide-react';

interface BackpackItemProps {
  backpack: {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    status: 'active' | 'completed' | 'abandoned';
    items: {
      id: string;
      name: string;
      type: 'spot' | 'itinerary' | 'event';
      price: number;
      date?: string;
      location?: string;
    }[];
    totalValue: number;
    createdAt: string;
    lastUpdated: string;
  };
  onDelete: (id: string) => void;
}

const BackpackItem = ({ backpack, onDelete }: BackpackItemProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'abandoned': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'completed': return 'Finalizada';
      case 'abandoned': return 'Abandonada';
      default: return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'spot': return 'Ponto Turístico';
      case 'itinerary': return 'Roteiro';
      case 'event': return 'Evento';
      default: return type;
    }
  };

  const handleViewDetails = () => {
    // Implementação para visualizar detalhes completos
    console.log('Visualizando detalhes da mochila:', backpack.id);
  };

  const handleStartChat = () => {
    // Implementação para iniciar chat com o usuário
    console.log('Iniciando chat com usuário:', backpack.userId);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                {backpack.userName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-lg">{backpack.userName}</h3>
                <Badge className={getStatusColor(backpack.status)}>
                  {getStatusLabel(backpack.status)}
                </Badge>
              </div>
              
              <div className="space-y-1 text-sm text-gray-600 mb-3">
                <p>Email: {backpack.userEmail}</p>
                <p>Criada: {new Date(backpack.createdAt).toLocaleDateString()}</p>
                <p>Atualizada: {new Date(backpack.lastUpdated).toLocaleDateString()}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="h-4 w-4" />
                  <span>{backpack.items.length} {backpack.items.length === 1 ? 'item' : 'itens'}</span>
                  <DollarSign className="h-4 w-4 ml-4" />
                  <span className="font-semibold text-green-600">R$ {backpack.totalValue}</span>
                </div>
                
                <div className="space-y-1">
                  <h4 className="font-medium text-sm">Itens na mochila:</h4>
                  {backpack.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <Badge variant="outline" className="text-xs py-0">
                            {getTypeLabel(item.type)}
                          </Badge>
                          {item.date && (
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(item.date).toLocaleDateString()}</span>
                            </span>
                          )}
                          {item.location && (
                            <span className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{item.location}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="font-bold text-green-600">R$ {item.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleViewDetails}
              className="flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>Detalhes</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleStartChat}
              className="flex items-center space-x-2"
            >
              <span>💬</span>
              <span>Chat</span>
            </Button>
            
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onDelete(backpack.id)}
              className="flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Excluir</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackpackItem;
