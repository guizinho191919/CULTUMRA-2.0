
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GuideInfoCardProps {
  guide: {
    pricePerHour: number;
    rating: number;
    experience: number;
    reviews: number;
  };
}

const GuideInfoCard = ({ guide }: GuideInfoCardProps) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold">Informações do Guia</h4>
          <Badge className="bg-cerrado-100 text-cerrado-800">
            R$ {guide.pricePerHour}/hora
          </Badge>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="font-semibold text-cerrado-600">{guide.rating}</div>
            <div className="text-gray-500">Avaliação</div>
          </div>
          <div>
            <div className="font-semibold text-cerrado-600">{guide.experience}</div>
            <div className="text-gray-500">Anos exp.</div>
          </div>
          <div>
            <div className="font-semibold text-cerrado-600">{guide.reviews}</div>
            <div className="text-gray-500">Avaliações</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuideInfoCard;
