import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TouristSpot } from '@/types';
import { Clock, Calendar, MapPin, Users, CreditCard, Smartphone, Car, Shield } from 'lucide-react';

interface SpotDetailedInfoProps {
  spot: TouristSpot;
}

const SpotDetailedInfo = ({ spot }: SpotDetailedInfoProps) => {
  const getDetailedInfo = () => {
    // Informações específicas baseadas na categoria do destino
    const baseInfo = {
      cashback: '3% de cashback',
      cashbackDesc: 'Dinheiro de volta para usar no MatoGrossoGuide',
      duration: '4h',
      startTime: '08:00h',
      days: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      cancellation: 'Cancelamento gratuito até 24h antes',
      voucher: 'Voucher digital ou impresso',
      voucherDesc: 'Use seu celular ou imprima seu voucher',
      transport: 'Transporte incluído',
      transportDesc: 'Busca em seu local de hospedagem',
      guide: 'Guia especializado',
      guideDesc: 'Acompanhamento com guia local experiente'
    };

    // Personalizar baseado na categoria
    if (spot.categories.includes('natureza')) {
      return {
        ...baseInfo,
        duration: '6h',
        startTime: '06:00h',
        days: ['Ter', 'Qui', 'Sáb', 'Dom'],
        overview: `Explore as belezas naturais de ${spot.name} em uma experiência única no coração de Mato Grosso. Desfrute de trilhas ecológicas, observação da fauna local e paisagens deslumbrantes do Cerrado e Pantanal.`
      };
    } else if (spot.categories.includes('aventura')) {
      return {
        ...baseInfo,
        duration: '5h',
        startTime: '07:00h',
        days: ['Qua', 'Sex', 'Sáb', 'Dom'],
        overview: `Viva uma aventura inesquecível em ${spot.name}. Atividades radicais e esportes de aventura em meio à natureza exuberante de Mato Grosso, com toda segurança e equipamentos profissionais.`
      };
    } else if (spot.categories.includes('cultura')) {
      return {
        ...baseInfo,
        duration: '3h',
        startTime: '14:00h',
        days: ['Ter', 'Qui', 'Sáb'],
        overview: `Mergulhe na rica cultura de Mato Grosso em ${spot.name}. Conheça tradições locais, artesanato regional e a história fascinante desta terra de contrastes e diversidade cultural.`
      };
    }

    return {
      ...baseInfo,
      overview: `Descubra ${spot.name}, um dos destinos mais incríveis de Mato Grosso. Uma experiência completa que combina natureza, cultura e aventura em um só lugar.`
    };
  };

  const info = getDetailedInfo();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl text-cerrado-700">Informações da Experiência</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cashback */}
        <div className="flex items-start space-x-3">
          <div className="bg-green-100 p-2 rounded-full">
            <CreditCard className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h4 className="font-semibold text-green-700">{info.cashback}</h4>
            <p className="text-sm text-gray-600">{info.cashbackDesc}</p>
          </div>
        </div>

        {/* Duração e Horário */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-700">Duração aproximada: {info.duration}</h4>
              <p className="text-sm text-gray-600">Início às {info.startTime}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-purple-700">Dias da semana</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {info.days.map((day, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {day}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cancelamento e Voucher */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="bg-red-100 p-2 rounded-full">
              <Shield className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h4 className="font-semibold text-red-700">Cancelamento fácil</h4>
              <p className="text-sm text-gray-600">{info.cancellation}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="bg-indigo-100 p-2 rounded-full">
              <Smartphone className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h4 className="font-semibold text-indigo-700">{info.voucher}</h4>
              <p className="text-sm text-gray-600">{info.voucherDesc}</p>
            </div>
          </div>
        </div>

        {/* Transporte e Guia */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="bg-yellow-100 p-2 rounded-full">
              <Car className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-semibold text-yellow-700">{info.transport}</h4>
              <p className="text-sm text-gray-600">{info.transportDesc}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="bg-teal-100 p-2 rounded-full">
              <Users className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <h4 className="font-semibold text-teal-700">{info.guide}</h4>
              <p className="text-sm text-gray-600">{info.guideDesc}</p>
            </div>
          </div>
        </div>

        {/* Visão Geral */}
        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-800 mb-3">Visão Geral</h4>
          <p className="text-gray-700 leading-relaxed">{info.overview}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpotDetailedInfo;