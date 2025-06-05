
import { Button } from '@/components/ui/button';

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

interface UserStatusControlsProps {
  user: User;
  onStatusChange: (userId: string, newStatus: 'active' | 'pending' | 'suspended') => void;
}

const UserStatusControls = ({ user, onStatusChange }: UserStatusControlsProps) => {
  return (
    <div>
      <h4 className="font-medium mb-3">Alterar Status</h4>
      <div className="flex space-x-2">
        <Button 
          variant={user.status === 'active' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onStatusChange(user.id, 'active')}
        >
          Ativar
        </Button>
        <Button 
          variant={user.status === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onStatusChange(user.id, 'pending')}
        >
          Pendente
        </Button>
        <Button 
          variant={user.status === 'suspended' ? 'destructive' : 'outline'}
          size="sm"
          onClick={() => onStatusChange(user.id, 'suspended')}
        >
          Suspender
        </Button>
      </div>
    </div>
  );
};

export default UserStatusControls;
