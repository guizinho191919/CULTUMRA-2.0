
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmptySearchStateProps {
  searchTerm: string;
  totalResults: number;
  onExplore: () => void;
}

const EmptySearchState = ({ searchTerm, totalResults, onExplore }: EmptySearchStateProps) => {
  // No Results
  if (searchTerm && totalResults === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum resultado encontrado
          </h3>
          <p className="text-gray-600 mb-4">
            Tente buscar por outros termos ou explore nossas categorias
          </p>
          <Button onClick={onExplore}>
            Explorar Destinos
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Default Content when no search
  if (!searchTerm) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Comece sua busca
        </h3>
        <p className="text-gray-600">
          Digite acima para encontrar destinos, guias e eventos incríveis
        </p>
      </div>
    );
  }

  return null;
};

export default EmptySearchState;
