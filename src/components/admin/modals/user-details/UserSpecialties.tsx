
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

interface UserSpecialtiesProps {
  user: User;
}

const UserSpecialties = ({ user }: UserSpecialtiesProps) => {
  if (user.type !== 'guide' || !user.specialties) return null;

  return (
    <div>
      <h4 className="font-medium mb-2">Especialidades</h4>
      <div className="flex flex-wrap gap-2">
        {user.specialties.map((specialty, index) => (
          <Badge key={index} variant="secondary">{specialty}</Badge>
        ))}
      </div>
    </div>
  );
};

export default UserSpecialties;
