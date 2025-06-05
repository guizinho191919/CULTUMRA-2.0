
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

interface UserAdditionalInfoProps {
  user: User;
}

const UserAdditionalInfo = ({ user }: UserAdditionalInfoProps) => {
  return (
    <div className="text-sm text-gray-600 border-t pt-4">
      <p>Membro desde: {new Date(user.createdAt).toLocaleDateString()}</p>
      <p>ID do usuário: {user.id}</p>
    </div>
  );
};

export default UserAdditionalInfo;
