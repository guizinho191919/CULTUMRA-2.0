import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

interface PaymentStatusProps {
  guideId: string;
}

const PaymentStatus = ({ guideId }: PaymentStatusProps) => {
  const { checkPaidReservation } = useAuth();
  const hasPaid = checkPaidReservation(guideId);

  return (
    <Badge 
      variant={hasPaid ? "default" : "secondary"}
      className={hasPaid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}
    >
      {hasPaid ? "✅ Serviço Contratado" : "💳 Pagamento Necessário"}
    </Badge>
  );
};

export default PaymentStatus;