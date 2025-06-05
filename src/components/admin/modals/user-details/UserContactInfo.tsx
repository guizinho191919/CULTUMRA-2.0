
import { Phone, MapPin, FileText, Star } from 'lucide-react';

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

interface UserContactInfoProps {
  user: User;
}

const UserContactInfo = ({ user }: UserContactInfoProps) => {
  return (
    <>
      {/* Informações de Contato */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="font-medium flex items-center space-x-2">
            <Phone className="h-4 w-4" />
            <span>Telefone</span>
          </h4>
          <p className="text-gray-600">{user.phone || 'Não informado'}</p>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>Localização</span>
          </h4>
          <p className="text-gray-600">{user.location || 'Não informada'}</p>
        </div>
      </div>

      {/* CADASTUR para Guias */}
      {user.type === 'guide' && (
        <div className="space-y-2">
          <h4 className="font-medium flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>CADASTUR</span>
          </h4>
          <p className="text-gray-600 font-mono">{user.cadastur || 'Não informado'}</p>
        </div>
      )}

      {/* Rating para Guias */}
      {user.type === 'guide' && user.rating && (
        <div className="flex items-center space-x-2">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="font-medium">{user.rating}</span>
          <span className="text-gray-600">({user.reviewsCount} avaliações)</span>
        </div>
      )}
    </>
  );
};

export default UserContactInfo;
