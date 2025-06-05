
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchFormProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const SearchForm = ({ searchTerm, onSearchTermChange, onSubmit }: SearchFormProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <form onSubmit={onSubmit} className="flex gap-2">
          <Input
            placeholder="Digite sua busca..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            Buscar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SearchForm;
