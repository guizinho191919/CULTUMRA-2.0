
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Eye, Edit, Trash2, Star, Phone, MapPin, Wallet, FileText, 
  CheckCircle, XCircle, AlertCircle 
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'tourist' | 'guide';
  status: 'active' | 'pending' | 'suspended';
  balance: number;
  createdAt: string;
  phone?: string;
  location?: string;
  specialties?: string[];
  cadastur?: string;
  rating?: number;
  reviewsCount?: number;
}

interface UserCardProps {
  user: User;
  onViewDetails: (user: User) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onStatusChange: (userId: string, newStatus: 'active' | 'pending' | 'suspended') => void;
}

const UserCard = ({ 
  user, 
  onViewDetails, 
  onEditUser, 
  onDeleteUser, 
  onStatusChange 
}: UserCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'suspended': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'pending': return 'Pendente';
      case 'suspended': return 'Suspenso';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'pending': return AlertCircle;
      case 'suspended': return XCircle;
      default: return AlertCircle;
    }
  };

  const StatusIcon = getStatusIcon(user.status);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-lg">{user.name}</h3>
                <Badge className={getStatusColor(user.status)}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {getStatusLabel(user.status)}
                </Badge>
                <Badge variant="outline">
                  {user.type === 'guide' ? 'Guia' : 'Turista'}
                </Badge>
              </div>
              
              <div className="space-y-1 text-sm text-gray-600 mb-3">
                <p>Email: {user.email}</p>
                {user.phone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="h-3 w-3" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.type === 'guide' && user.cadastur && (
                  <div className="flex items-center space-x-1">
                    <FileText className="h-3 w-3" />
                    <span>CADASTUR: {user.cadastur}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Wallet className="h-4 w-4 text-green-600" />
                  <span className="font-semibold">R$ {user.balance.toFixed(2)}</span>
                </div>
                {user.type === 'guide' && user.rating && (
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{user.rating} ({user.reviewsCount} avaliações)</span>
                  </div>
                )}
              </div>

              {user.type === 'guide' && user.specialties && (
                <div className="mt-2">
                  <div className="flex flex-wrap gap-1">
                    {user.specialties.slice(0, 3).map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {user.specialties.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{user.specialties.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewDetails(user)}
              className="flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>Ver Detalhes</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEditUser(user)}
              className="flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Editar</span>
            </Button>

            {/* Botões de Status */}
            <div className="flex space-x-1">
              {user.status !== 'active' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onStatusChange(user.id, 'active')}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  <CheckCircle className="h-3 w-3" />
                </Button>
              )}
              {user.status !== 'suspended' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onStatusChange(user.id, 'suspended')}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <XCircle className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onDeleteUser(user.id)}
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

export default UserCard;
