
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, X } from 'lucide-react';

interface AddCardFormProps {
  onSave: (card: {
    nickname: string;
    holderName: string;
    cardNumber: string;
    lastFour: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
    cvv: string;
  }) => void;
  onCancel: () => void;
}

const AddCardForm = ({ onSave, onCancel }: AddCardFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nickname: '',
    holderName: '',
    cardNumber: '',
    expiryMonth: 1,
    expiryYear: new Date().getFullYear(),
    cvv: ''
  });

  const cardBrands = [
    { value: 'visa', label: 'Visa' },
    { value: 'mastercard', label: 'Mastercard' },
    { value: 'elo', label: 'Elo' },
    { value: 'amex', label: 'American Express' },
  ];

  const detectCardBrand = (number: string) => {
    const firstDigit = number.charAt(0);
    const firstTwoDigits = number.substring(0, 2);
    
    if (firstDigit === '4') return 'visa';
    if (['51', '52', '53', '54', '55'].includes(firstTwoDigits)) return 'mastercard';
    if (firstTwoDigits === '34' || firstTwoDigits === '37') return 'amex';
    if (['40', '41', '43', '50', '60', '63', '65', '66', '67'].includes(firstTwoDigits)) return 'elo';
    return 'visa';
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData({ ...formData, cardNumber: formatted });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nickname || !formData.holderName || !formData.cardNumber || !formData.cvv) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const cleanCardNumber = formData.cardNumber.replace(/\s/g, '');
    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      toast({
        title: "Número inválido",
        description: "O número do cartão deve ter entre 13 e 19 dígitos.",
        variant: "destructive",
      });
      return;
    }

    const lastFour = cleanCardNumber.slice(-4);
    const brand = detectCardBrand(cleanCardNumber);

    onSave({
      nickname: formData.nickname,
      holderName: formData.holderName,
      cardNumber: cleanCardNumber,
      lastFour,
      brand,
      expiryMonth: formData.expiryMonth,
      expiryYear: formData.expiryYear,
      cvv: formData.cvv
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Adicionar Novo Cartão</span>
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="nickname">Apelido do Cartão *</Label>
              <Input
                id="nickname"
                placeholder="Ex: Cartão Principal"
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="holderName">Nome do Titular *</Label>
              <Input
                id="holderName"
                placeholder="Nome como está no cartão"
                value={formData.holderName}
                onChange={(e) => setFormData({ ...formData, holderName: e.target.value.toUpperCase() })}
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="cardNumber">Número do Cartão *</Label>
              <Input
                id="cardNumber"
                placeholder="0000 0000 0000 0000"
                value={formData.cardNumber}
                onChange={handleCardNumberChange}
                maxLength={23}
                required
              />
            </div>

            <div>
              <Label htmlFor="expiryMonth">Mês de Validade *</Label>
              <select
                id="expiryMonth"
                className="w-full p-2 border rounded-md"
                value={formData.expiryMonth}
                onChange={(e) => setFormData({ ...formData, expiryMonth: parseInt(e.target.value) })}
                required
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>
                    {month.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="expiryYear">Ano de Validade *</Label>
              <select
                id="expiryYear"
                className="w-full p-2 border rounded-md"
                value={formData.expiryYear}
                onChange={(e) => setFormData({ ...formData, expiryYear: parseInt(e.target.value) })}
                required
              >
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="cvv">CVV *</Label>
              <Input
                id="cvv"
                placeholder="123"
                maxLength={4}
                value={formData.cvv}
                onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '') })}
                required
              />
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" className="flex-1">
              Salvar Cartão
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddCardForm;
