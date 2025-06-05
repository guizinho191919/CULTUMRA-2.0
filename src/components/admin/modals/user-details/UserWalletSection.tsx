
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wallet, Plus, Minus } from 'lucide-react';

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

interface UserWalletSectionProps {
  user: User;
  onUpdateBalance: (userId: string, amount: number) => void;
  onGeneratePixKey: () => void;
  onGenerateQRCode: (userId: string) => void;
}

const UserWalletSection = ({ user, onUpdateBalance, onGeneratePixKey, onGenerateQRCode }: UserWalletSectionProps) => {
  const [balanceAmount, setBalanceAmount] = useState('');

  const handleAddBalance = () => {
    const amount = parseFloat(balanceAmount);
    if (!isNaN(amount) && amount > 0) {
      onUpdateBalance(user.id, amount);
      setBalanceAmount('');
    }
  };

  const handleRemoveBalance = () => {
    const amount = parseFloat(balanceAmount);
    if (!isNaN(amount) && amount > 0) {
      onUpdateBalance(user.id, -amount);
      setBalanceAmount('');
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <h4 className="font-medium flex items-center space-x-2 mb-3">
        <Wallet className="h-4 w-4" />
        <span>Carteira Digital</span>
      </h4>
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg">Saldo atual:</span>
        <span className="text-2xl font-bold text-green-600">
          R$ {user.balance.toFixed(2)}
        </span>
      </div>
      
      <div className="flex space-x-2 mb-3">
        <Input
          type="number"
          placeholder="Valor"
          value={balanceAmount}
          onChange={(e) => setBalanceAmount(e.target.value)}
          step="0.01"
          min="0"
        />
        <Button 
          variant="outline" 
          onClick={handleAddBalance}
          className="flex items-center space-x-1"
        >
          <Plus className="h-4 w-4" />
          <span>Adicionar</span>
        </Button>
        <Button 
          variant="outline" 
          onClick={handleRemoveBalance}
          className="flex items-center space-x-1"
        >
          <Minus className="h-4 w-4" />
          <span>Debitar</span>
        </Button>
      </div>

      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onGeneratePixKey}
          className="flex-1"
        >
          Gerar Chave PIX
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onGenerateQRCode(user.id)}
          className="flex-1"
        >
          Gerar QR Code
        </Button>
      </div>
    </div>
  );
};

export default UserWalletSection;
