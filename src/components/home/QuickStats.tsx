
import { Card, CardContent } from '@/components/ui/card';
import { mockTouristSpots, mockGuides, mockItineraries } from '@/data/mockData';

const QuickStats = () => {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="text-center p-4">
        <CardContent className="p-0">
          <div className="text-2xl font-bold text-cerrado-600">{mockTouristSpots.length}</div>
          <div className="text-sm text-gray-600">Destinos</div>
        </CardContent>
      </Card>
      <Card className="text-center p-4">
        <CardContent className="p-0">
          <div className="text-2xl font-bold text-pantanal-600">{mockGuides.length}</div>
          <div className="text-sm text-gray-600">Guias Certificados</div>
        </CardContent>
      </Card>
      <Card className="text-center p-4">
        <CardContent className="p-0">
          <div className="text-2xl font-bold text-dourado-600">{mockItineraries.length}</div>
          <div className="text-sm text-gray-600">Roteiros</div>
        </CardContent>
      </Card>
      <Card className="text-center p-4">
        <CardContent className="p-0">
          <div className="text-2xl font-bold text-green-600">4.8⭐</div>
          <div className="text-sm text-gray-600">Avaliação</div>
        </CardContent>
      </Card>
    </section>
  );
};

export default QuickStats;
