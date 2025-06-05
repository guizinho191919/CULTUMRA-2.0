import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Restaurant } from '@/types/restaurant';
import { useAuth } from '@/contexts/AuthContext';

interface RestaurantActionButtonsProps {
  restaurant: Restaurant;
  inBackpack: boolean;
  onAddToBackpack: () => void;
  getPriceEstimate: () => number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const RestaurantActionButtons = ({
  restaurant,
  inBackpack,
  onAddToBackpack,
  getPriceEstimate,
  isFavorite,
  onToggleFavorite
}: RestaurantActionButtonsProps) => {
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
          onClick={onToggleFavorite}
        >
          {isFavorite ? '❤️ Favoritado' : '🤍 Favoritar'}
        </Button>
      </div>
    </div>
  );
};

export default RestaurantActionButtons;