
import { Card, CardContent } from '@/components/ui/card';
import { Users, Star, CheckCircle } from 'lucide-react';

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

interface UserStatisticsProps {
  users: User[];
}

const UserStatistics = ({ users }: UserStatisticsProps) => {
  const guides = users.filter(u => u.type === 'guide');
  const tourists = users.filter(u => u.type === 'tourist');
  const activeUsers = users.filter(u => u.status === 'active');

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total de Usuários</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Star className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Guias</p>
              <p className="text-2xl font-bold">{guides.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Turistas</p>
              <p className="text-2xl font-bold">{tourists.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Usuários Ativos</p>
              <p className="text-2xl font-bold">{activeUsers.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStatistics;
