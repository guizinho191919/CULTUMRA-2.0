
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

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

interface UserHeaderProps {
  user: User;
}

const UserHeader = ({ user }: UserHeaderProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'suspended': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex items-start space-x-4">
      <Avatar className="h-16 w-16">
        <AvatarFallback className="text-lg">
          {user.name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h3 className="text-xl font-semibold">{user.name}</h3>
        <p className="text-gray-600">{user.email}</p>
        <div className="flex items-center space-x-2 mt-2">
          <Badge className={getStatusColor(user.status)}>
            {user.status === 'active' ? 'Ativo' : 
             user.status === 'pending' ? 'Pendente' : 'Suspenso'}
          </Badge>
          <Badge variant="outline">
            {user.type === 'guide' ? 'Guia' : 'Turista'}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
