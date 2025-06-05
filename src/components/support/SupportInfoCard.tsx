
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const SupportInfoCard = () => {
  return (
    <Card className="mb-3">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
          Como podemos te ajudar?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-gray-600 text-sm">
          Nossa equipe está disponível 24 horas para esclarecer suas dúvidas sobre:
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center text-gray-600">
            <span className="mr-2">📱</span>
            Problemas técnicos
          </div>
          <div className="flex items-center text-gray-600">
            <span className="mr-2">💳</span>
            Pagamentos
          </div>
          <div className="flex items-center text-gray-600">
            <span className="mr-2">📅</span>
            Reservas
          </div>
          <div className="flex items-center text-gray-600">
            <span className="mr-2">🗺️</span>
            Roteiros
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupportInfoCard;
