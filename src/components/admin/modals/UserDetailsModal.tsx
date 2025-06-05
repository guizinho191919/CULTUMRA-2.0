
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAdminSystem } from '@/hooks/useAdminSystem';
import UserHeader from './user-details/UserHeader';
import UserContactInfo from './user-details/UserContactInfo';
import UserSpecialties from './user-details/UserSpecialties';
import UserWalletSection from './user-details/UserWalletSection';
import UserStatusControls from './user-details/UserStatusControls';
import UserAdditionalInfo from './user-details/UserAdditionalInfo';

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

interface UserDetailsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserDetailsModal = ({ user, isOpen, onClose }: UserDetailsModalProps) => {
  const { updateUser, updateUserBalance, generatePixKey, generateQRCode } = useAdminSystem();

  if (!user) return null;

  const handleStatusChange = (userId: string, newStatus: 'active' | 'pending' | 'suspended') => {
    updateUser(userId, { status: newStatus });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Usuário</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <UserHeader user={user} />
          
          <UserContactInfo user={user} />
          
          <UserSpecialties user={user} />

          <UserWalletSection 
            user={user}
            onUpdateBalance={updateUserBalance}
            onGeneratePixKey={generatePixKey}
            onGenerateQRCode={generateQRCode}
          />

          <UserStatusControls 
            user={user}
            onStatusChange={handleStatusChange}
          />

          <UserAdditionalInfo user={user} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
