import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { mockGuides } from '@/data/mockData';
import { Users, MapPin, Calendar as CalendarIcon, Clock } from 'lucide-react';

const ProposalRequest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  const [travelDate, setTravelDate] = useState<Date | undefined>(
    location.state?.travelDate ? new Date(location.state.travelDate) : undefined
  );
  const [groupSize, setGroupSize] = useState(2);
  const [duration, setDuration] = useState('1');
  const [interests, setInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');
  
  const interestOptions = [
    'Pantanal', 'Chapada dos Guimarães', 'Centro Histórico', 
    'Gastronomia', 'Pesca Esportiva', 'Trekking', 'Observação de Fauna'
  ];
  
  const handleSubmitRequest = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!travelDate || interests.length === 0) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    // Simular envio para múltiplos guias
    const relevantGuides = mockGuides.filter(guide => 
      guide.specialties.some(specialty => 
        interests.some(interest => 
          specialty.toLowerCase().includes(interest.toLowerCase())
        )
      )
    );
    
    toast({
      title: "Solicitação enviada!",
      description: `Sua solicitação foi enviada para ${relevantGuides.length} guias especializados. Você receberá propostas em breve.`,
    });
    
    navigate('/proposals');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Solicitar Orçamentos de Guias
            </CardTitle>
            <p className="text-center text-gray-600">
              Preencha os detalhes da sua viagem e receba propostas personalizadas
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Data da Viagem */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <CalendarIcon className="inline h-4 w-4 mr-1" />
                Data da Viagem *
              </label>
              <Calendar
                mode="single"
                selected={travelDate}
                onSelect={setTravelDate}
                disabled={(date) => date < new Date()}
                className="rounded-md border mx-auto"
              />
            </div>
            
            {/* Tamanho do Grupo */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Users className="inline h-4 w-4 mr-1" />
                Número de Pessoas
              </label>
              <select 
                value={groupSize} 
                onChange={(e) => setGroupSize(Number(e.target.value))}
                className="w-full p-2 border rounded-md"
              >
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <option key={num} value={num}>{num} pessoa{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            
            {/* Duração */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                Duração da Experiência
              </label>
              <select 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="0.5">Meio dia (4 horas)</option>
                <option value="1">1 dia inteiro</option>
                <option value="2">2 dias</option>
                <option value="3">3 dias</option>
                <option value="4">4 dias</option>
                <option value="5+">5+ dias</option>
              </select>
            </div>
            
            {/* Interesses */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Áreas de Interesse *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {interestOptions.map(option => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={interests.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setInterests([...interests, option]);
                        } else {
                          setInterests(interests.filter(i => i !== option));
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Orçamento */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Orçamento Estimado (opcional)
              </label>
              <select 
                value={budget} 
                onChange={(e) => setBudget(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Selecione uma faixa</option>
                <option value="ate-200">Até R$ 200</option>
                <option value="200-500">R$ 200 - R$ 500</option>
                <option value="500-1000">R$ 500 - R$ 1.000</option>
                <option value="1000+">Acima de R$ 1.000</option>
              </select>
            </div>
            
            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Detalhes Adicionais
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva suas expectativas, necessidades especiais, locais específicos de interesse..."
                className="w-full p-2 border rounded-md h-24 resize-none"
              />
            </div>
            
            {/* Botões */}
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                Voltar
              </Button>
              <Button 
                onClick={handleSubmitRequest}
                className="flex-1 bg-pantanal-600 hover:bg-pantanal-700"
              >
                Enviar Solicitação
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProposalRequest;