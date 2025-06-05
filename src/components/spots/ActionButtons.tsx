
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TouristSpot } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface ActionButtonsProps {
  spot: TouristSpot;
  inBackpack: boolean;
  onAddToBackpack: () => void;
  getPriceEstimate: () => number;
}

const ActionButtons = ({ spot, inBackpack, onAddToBackpack, getPriceEstimate }: ActionButtonsProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleAddToBackpack = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    onAddToBackpack();
  };

  return (
    <div className="space-y-4">
      <Button 
        className={`w-full text-lg h-14 ${inBackpack ? 'bg-green-600 hover:bg-green-700' : 'bg-cerrado-600 hover:bg-cerrado-700'}`}
        onClick={handleAddToBackpack}
        disabled={inBackpack}
      >
        {inBackpack ? '✅ Na Mochila' : `🎒 Adicionar à Mochila - R$ ${getPriceEstimate()}`}
      </Button>
      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          className="h-14 text-sm w-full"
          onClick={() => navigate('/search?q=guias')}
        >
          🧭 Encontrar Guia
        </Button>
        <Button 
          variant="outline"
          className="h-14 text-sm w-full"
        >
          ❤️ Favoritar
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;
