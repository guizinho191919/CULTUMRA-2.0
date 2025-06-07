import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Guide, TouristSpot } from '@/types';
import { Calendar as CalendarIcon, MapPin, Users, Clock, Plus, X } from 'lucide-react';
import { mockTouristSpots } from '@/data/mockData';

interface CustomProposalRequestProps {
  guide: Guide;
  onClose: () => void;
  onBackToBooking: () => void;
}

interface SelectedSpot {
  spot: TouristSpot;
  duration: number; // horas
  priority: 'alta' | 'media' | 'baixa';
}

const CustomProposalRequest = ({ guide, onClose, onBackToBooking }: CustomProposalRequestProps) => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [groupSize, setGroupSize] = useState(2);
  const [selectedSpots, setSelectedSpots] = useState<SelectedSpot[]>([]);
  const [budget, setBudget] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [showSpotSelector, setShowSpotSelector] = useState(false);
  const [searchSpot, setSearchSpot] = useState('');

  // Filtrar pontos turísticos disponíveis
  const availableSpots = mockTouristSpots.filter(spot => 
    spot.name.toLowerCase().includes(searchSpot.toLowerCase()) ||
    spot.location.city.toLowerCase().includes(searchSpot.toLowerCase())
  );

  const addSpot = (spot: TouristSpot) => {
    if (!selectedSpots.find(s => s.spot.id === spot.id)) {
      setSelectedSpots([...selectedSpots, {
        spot,
        duration: 4,
        priority: 'media'
      }]);
    }
    setShowSpotSelector(false);
    setSearchSpot('');
  };

  const removeSpot = (spotId: string) => {
    setSelectedSpots(selectedSpots.filter(s => s.spot.id !== spotId));
  };

  const updateSpotDuration = (spotId: string, duration: number) => {
    setSelectedSpots(selectedSpots.map(s => 
      s.spot.id === spotId ? { ...s, duration } : s
    ));
  };

  const updateSpotPriority = (spotId: string, priority: 'alta' | 'media' | 'baixa') => {
    setSelectedSpots(selectedSpots.map(s => 
      s.spot.id === spotId ? { ...s, priority } : s
    ));
  };

  const calculateTotalDays = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSubmitRequest = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Faça login para solicitar uma proposta.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (!startDate || !endDate || selectedSpots.length === 0) {
      toast({
        title: "Dados incompletos",
        description: "Preencha as datas e selecione pelo menos um ponto de interesse.",
        variant: "destructive",
      });
      return;
    }

    // Simular envio da solicitação
    toast({
      title: "Solicitação enviada!",
      description: `Sua solicitação foi enviada para ${guide.name}. Você receberá uma proposta em até 24 horas.`,
    });

    // Aqui você enviaria os dados para o backend
    const proposalData = {
      guideId: guide.id,
      clientId: user?.id,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      groupSize,
      selectedSpots: selectedSpots.map(s => ({
        spotId: s.spot.id,
        spotName: s.spot.name,
        duration: s.duration,
        priority: s.priority
      })),
      budget,
      specialRequests,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    console.log('Dados da solicitação:', proposalData);
    onClose();
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      alta: 'bg-red-100 text-red-800',
      media: 'bg-yellow-100 text-yellow-800',
      baixa: 'bg-green-100 text-green-800'
    };
    return colors[priority as keyof typeof colors];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-none">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Solicitar Proposta Personalizada</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Conte para {guide.name} sobre sua viagem e receba uma proposta sob medida
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" onClick={onBackToBooking} className="h-8 px-3">
                  ← Voltar
                </Button>
                <Button variant="ghost" onClick={onClose} className="h-8 w-8 p-0">
                  ×
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informações da Viagem */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Detalhes da Viagem</h3>
                  
                  {/* Datas */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <CalendarIcon className="inline h-4 w-4 mr-1" />
                        Período da viagem
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-500">Data de início</label>
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            disabled={(date) => date < new Date()}
                            className="rounded-md border"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Data de fim</label>
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            disabled={(date) => date < new Date() || (startDate && date < startDate)}
                            className="rounded-md border"
                          />
                        </div>
                      </div>
                      {startDate && endDate && (
                        <p className="text-sm text-gray-600 mt-2">
                          Duração: {calculateTotalDays()} dias
                        </p>
                      )}
                    </div>

                    {/* Tamanho do grupo */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <Users className="inline h-4 w-4 mr-1" />
                        Tamanho do grupo
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

                    {/* Orçamento */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        💰 Orçamento estimado (opcional)
                      </label>
                      <select 
                        value={budget} 
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="">Não tenho preferência</option>
                        <option value="ate-500">Até R$ 500 por pessoa</option>
                        <option value="500-1000">R$ 500 - R$ 1.000 por pessoa</option>
                        <option value="1000-2000">R$ 1.000 - R$ 2.000 por pessoa</option>
                        <option value="acima-2000">Acima de R$ 2.000 por pessoa</option>
                      </select>
                    </div>

                    {/* Solicitações especiais */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        📝 Solicitações especiais
                      </label>
                      <textarea
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="Conte sobre suas preferências, necessidades especiais, tipo de experiência que busca..."
                        className="w-full p-3 border rounded-md h-24 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pontos de Interesse */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    <MapPin className="inline h-5 w-5 mr-1" />
                    Pontos de Interesse
                  </h3>
                  <Button 
                    onClick={() => setShowSpotSelector(true)}
                    size="sm"
                    className="bg-pantanal-600 hover:bg-pantanal-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </div>

                {selectedSpots.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Nenhum ponto selecionado</p>
                    <p className="text-sm">Adicione os locais que gostaria de visitar</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedSpots.map((selectedSpot) => (
                      <div key={selectedSpot.spot.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium">{selectedSpot.spot.name}</h4>
                            <p className="text-sm text-gray-600">{selectedSpot.spot.location.city}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSpot(selectedSpot.spot.id)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-gray-500">Tempo desejado</label>
                            <select 
                              value={selectedSpot.duration}
                              onChange={(e) => updateSpotDuration(selectedSpot.spot.id, Number(e.target.value))}
                              className="w-full p-1 border rounded text-sm"
                            >
                              <option value={2}>2 horas</option>
                              <option value={4}>4 horas</option>
                              <option value={6}>6 horas</option>
                              <option value={8}>Dia inteiro</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">Prioridade</label>
                            <select 
                              value={selectedSpot.priority}
                              onChange={(e) => updateSpotPriority(selectedSpot.spot.id, e.target.value as 'alta' | 'media' | 'baixa')}
                              className="w-full p-1 border rounded text-sm"
                            >
                              <option value="alta">Alta</option>
                              <option value="media">Média</option>
                              <option value="baixa">Baixa</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <Badge className={getPriorityColor(selectedSpot.priority)}>
                            Prioridade {selectedSpot.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Seletor de pontos */}
                {showSpotSelector && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                      <div className="p-4 border-b">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Selecionar Ponto de Interesse</h3>
                          <Button 
                            variant="ghost" 
                            onClick={() => setShowSpotSelector(false)}
                            className="h-8 w-8 p-0"
                          >
                            ×
                          </Button>
                        </div>
                        <input
                          type="text"
                          placeholder="Buscar por nome ou cidade..."
                          value={searchSpot}
                          onChange={(e) => setSearchSpot(e.target.value)}
                          className="w-full mt-3 p-2 border rounded-md"
                        />
                      </div>
                      <div className="p-4 space-y-3">
                        {availableSpots.slice(0, 10).map((spot) => (
                          <div 
                            key={spot.id} 
                            className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                            onClick={() => addSpot(spot)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{spot.name}</h4>
                                <p className="text-sm text-gray-600">{spot.location.city}, {spot.location.state}</p>
                                <div className="flex items-center mt-1">
                                  <span className="text-yellow-400">⭐</span>
                                  <span className="text-sm ml-1">{spot.rating}</span>
                                </div>
                              </div>
                              <Button size="sm" className="bg-pantanal-600 hover:bg-pantanal-700">
                                Adicionar
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Resumo e Botões */}
            <div className="mt-6 pt-6 border-t">
              {startDate && endDate && selectedSpots.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium mb-2">Resumo da Solicitação</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Período:</strong> {startDate.toLocaleDateString()} a {endDate.toLocaleDateString()} ({calculateTotalDays()} dias)</p>
                    <p><strong>Grupo:</strong> {groupSize} pessoa{groupSize > 1 ? 's' : ''}</p>
                    <p><strong>Pontos de interesse:</strong> {selectedSpots.length} local{selectedSpots.length > 1 ? 'is' : ''}</p>
                    {budget && <p><strong>Orçamento:</strong> {budget.replace('-', ' - R$ ').replace('ate', 'Até R$ ').replace('acima', 'Acima de R$ ')}</p>}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={onBackToBooking}>
                  Voltar para Contratação Rápida
                </Button>
                <Button 
                  onClick={handleSubmitRequest}
                  disabled={!startDate || !endDate || selectedSpots.length === 0}
                  className="bg-pantanal-600 hover:bg-pantanal-700"
                >
                  Solicitar Proposta Personalizada
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomProposalRequest;