import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Calendar, MapPin, Users, Clock, DollarSign, MessageSquare } from 'lucide-react';

interface ProposalRequest {
  id: string;
  clientName: string;
  clientId: string;
  startDate: string;
  endDate: string;
  groupSize: number;
  selectedSpots: {
    spotId: string;
    spotName: string;
    duration: number;
    priority: 'alta' | 'media' | 'baixa';
  }[];
  budget: string;
  specialRequests: string;
  status: 'pending' | 'quoted' | 'accepted' | 'rejected';
  createdAt: string;
  quote?: {
    totalPrice: number;
    breakdown: {
      item: string;
      price: number;
    }[];
    notes: string;
    validUntil: string;
  };
}

const ProposalManagement = () => {
  const { toast } = useToast();
  const [proposals, setProposals] = useState<ProposalRequest[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<ProposalRequest | null>(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteData, setQuoteData] = useState({
    totalPrice: 0,
    breakdown: [{ item: '', price: 0 }],
    notes: '',
    validUntil: ''
  });

  useEffect(() => {
    // Simular carregamento de propostas
    const mockProposals: ProposalRequest[] = [
      {
        id: '1',
        clientName: 'Maria Silva',
        clientId: 'client1',
        startDate: '2024-05-15',
        endDate: '2024-05-18',
        groupSize: 4,
        selectedSpots: [
          { spotId: '1', spotName: 'Pantanal Norte', duration: 8, priority: 'alta' },
          { spotId: '2', spotName: 'Aquário Natural', duration: 4, priority: 'media' }
        ],
        budget: '1000-2000',
        specialRequests: 'Gostaríamos de focar na observação de aves e fotografia da natureza.',
        status: 'pending',
        createdAt: '2024-04-20T10:00:00Z'
      },
      {
        id: '2',
        clientName: 'João Santos',
        clientId: 'client2',
        startDate: '2024-05-20',
        endDate: '2024-05-22',
        groupSize: 2,
        selectedSpots: [
          { spotId: '3', spotName: 'Chapada dos Guimarães', duration: 6, priority: 'alta' }
        ],
        budget: 'ate-500',
        specialRequests: 'Primeira vez no Mato Grosso, queremos uma experiência autêntica.',
        status: 'quoted',
        createdAt: '2024-04-18T14:30:00Z',
        quote: {
          totalPrice: 800,
          breakdown: [
            { item: 'Guia especializado (2 dias)', price: 400 },
            { item: 'Transporte', price: 200 },
            { item: 'Entrada nos parques', price: 100 },
            { item: 'Lanche e água', price: 100 }
          ],
          notes: 'Inclui transporte, entradas e lanche. Hospedagem não incluída.',
          validUntil: '2024-05-01'
        }
      }
    ];
    setProposals(mockProposals);
  }, []);

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      quoted: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors];
  };

  const getStatusText = (status: string) => {
    const texts = {
      pending: 'Aguardando orçamento',
      quoted: 'Orçamento enviado',
      accepted: 'Aceito',
      rejected: 'Rejeitado'
    };
    return texts[status as keyof typeof texts];
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      alta: 'bg-red-100 text-red-800',
      media: 'bg-yellow-100 text-yellow-800',
      baixa: 'bg-green-100 text-green-800'
    };
    return colors[priority as keyof typeof colors];
  };

  const addBreakdownItem = () => {
    setQuoteData(prev => ({
      ...prev,
      breakdown: [...prev.breakdown, { item: '', price: 0 }]
    }));
  };

  const updateBreakdownItem = (index: number, field: 'item' | 'price', value: string | number) => {
    setQuoteData(prev => ({
      ...prev,
      breakdown: prev.breakdown.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeBreakdownItem = (index: number) => {
    setQuoteData(prev => ({
      ...prev,
      breakdown: prev.breakdown.filter((_, i) => i !== index)
    }));
  };

  const calculateTotal = () => {
    return quoteData.breakdown.reduce((sum, item) => sum + item.price, 0);
  };

  const handleSendQuote = () => {
    if (!selectedProposal) return;

    const quote = {
      ...quoteData,
      totalPrice: calculateTotal()
    };

    setProposals(prev => prev.map(p => 
      p.id === selectedProposal.id 
        ? { ...p, status: 'quoted' as const, quote }
        : p
    ));

    toast({
      title: "Orçamento enviado!",
      description: `Seu orçamento foi enviado para ${selectedProposal.clientName}.`,
    });

    setShowQuoteForm(false);
    setSelectedProposal(null);
    setQuoteData({
      totalPrice: 0,
      breakdown: [{ item: '', price: 0 }],
      notes: '',
      validUntil: ''
    });
  };

  const handleRejectProposal = (proposalId: string) => {
    setProposals(prev => prev.map(p => 
      p.id === proposalId 
        ? { ...p, status: 'rejected' as const }
        : p
    ));

    toast({
      title: "Proposta rejeitada",
      description: "A proposta foi rejeitada e o cliente foi notificado.",
    });
  };

  if (showQuoteForm && selectedProposal) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Criar Orçamento</h2>
            <p className="text-gray-600">Proposta para {selectedProposal.clientName}</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => {
              setShowQuoteForm(false);
              setSelectedProposal(null);
            }}
          >
            ← Voltar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Detalhes da solicitação */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Viagem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{new Date(selectedProposal.startDate).toLocaleDateString()} a {new Date(selectedProposal.endDate).toLocaleDateString()}</span>
                <Badge variant="outline">{calculateDays(selectedProposal.startDate, selectedProposal.endDate)} dias</Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span>{selectedProposal.groupSize} pessoa{selectedProposal.groupSize > 1 ? 's' : ''}</span>
              </div>

              <div>
                <h4 className="font-medium mb-2">Pontos de Interesse</h4>
                <div className="space-y-2">
                  {selectedProposal.selectedSpots.map((spot, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium">{spot.spotName}</span>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="h-3 w-3" />
                          <span>{spot.duration}h</span>
                          <Badge className={`${getPriorityColor(spot.priority)} text-xs`}>
                            {spot.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedProposal.specialRequests && (
                <div>
                  <h4 className="font-medium mb-2">Solicitações Especiais</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {selectedProposal.specialRequests}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Formulário de orçamento */}
          <Card>
            <CardHeader>
              <CardTitle>Criar Orçamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Itens do Orçamento</label>
                <div className="space-y-2">
                  {quoteData.breakdown.map((item, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Descrição do item"
                        value={item.item}
                        onChange={(e) => updateBreakdownItem(index, 'item', e.target.value)}
                        className="flex-1 p-2 border rounded"
                      />
                      <input
                        type="number"
                        placeholder="Preço"
                        value={item.price}
                        onChange={(e) => updateBreakdownItem(index, 'price', Number(e.target.value))}
                        className="w-24 p-2 border rounded"
                      />
                      {quoteData.breakdown.length > 1 && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeBreakdownItem(index)}
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addBreakdownItem}
                  className="mt-2"
                >
                  + Adicionar item
                </Button>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span>R$ {calculateTotal()}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Observações</label>
                <textarea
                  value={quoteData.notes}
                  onChange={(e) => setQuoteData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Informações adicionais sobre o orçamento..."
                  className="w-full p-3 border rounded h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Válido até</label>
                <input
                  type="date"
                  value={quoteData.validUntil}
                  onChange={(e) => setQuoteData(prev => ({ ...prev, validUntil: e.target.value }))}
                  className="w-full p-2 border rounded"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="flex space-x-3">
                <Button 
                  onClick={handleSendQuote}
                  disabled={!quoteData.validUntil || quoteData.breakdown.some(item => !item.item || item.price <= 0)}
                  className="flex-1 bg-pantanal-600 hover:bg-pantanal-700"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Enviar Orçamento
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Propostas Personalizadas</h2>
        <p className="text-gray-600">Gerencie as solicitações de propostas dos clientes</p>
      </div>

      {proposals.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma proposta recebida
            </h3>
            <p className="text-gray-600">
              Quando clientes solicitarem propostas personalizadas, elas aparecerão aqui.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {proposals.map((proposal) => (
            <Card key={proposal.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{proposal.clientName}</h3>
                    <p className="text-sm text-gray-600">
                      Solicitado em {new Date(proposal.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(proposal.status)}>
                    {getStatusText(proposal.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Período</p>
                      <p className="text-sm text-gray-600">
                        {new Date(proposal.startDate).toLocaleDateString()} - {new Date(proposal.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Grupo</p>
                      <p className="text-sm text-gray-600">{proposal.groupSize} pessoa{proposal.groupSize > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Locais</p>
                      <p className="text-sm text-gray-600">{proposal.selectedSpots.length} ponto{proposal.selectedSpots.length > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Orçamento</p>
                      <p className="text-sm text-gray-600">
                        {proposal.budget ? proposal.budget.replace('-', ' - R$ ').replace('ate', 'Até R$ ').replace('acima', 'Acima de R$ ') : 'Não informado'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">Pontos de Interesse</h4>
                  <div className="flex flex-wrap gap-2">
                    {proposal.selectedSpots.map((spot, index) => (
                      <div key={index} className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded">
                        <span className="text-sm">{spot.spotName}</span>
                        <Badge className={`${getPriorityColor(spot.priority)} text-xs`}>
                          {spot.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {proposal.specialRequests && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Solicitações Especiais</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {proposal.specialRequests}
                    </p>
                  </div>
                )}

                {proposal.quote && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Orçamento Enviado</h4>
                    <div className="space-y-1">
                      {proposal.quote.breakdown.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.item}</span>
                          <span>R$ {item.price}</span>
                        </div>
                      ))}
                      <div className="border-t pt-1 flex justify-between font-medium">
                        <span>Total</span>
                        <span>R$ {proposal.quote.totalPrice}</span>
                      </div>
                    </div>
                    {proposal.quote.notes && (
                      <p className="text-sm text-gray-600 mt-2">{proposal.quote.notes}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Válido até {new Date(proposal.quote.validUntil).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  {proposal.status === 'pending' && (
                    <>
                      <Button 
                        variant="outline"
                        onClick={() => handleRejectProposal(proposal.id)}
                      >
                        Rejeitar
                      </Button>
                      <Button 
                        onClick={() => {
                          setSelectedProposal(proposal);
                          setShowQuoteForm(true);
                        }}
                        className="bg-pantanal-600 hover:bg-pantanal-700"
                      >
                        Criar Orçamento
                      </Button>
                    </>
                  )}
                  {proposal.status === 'quoted' && (
                    <Badge className="bg-blue-100 text-blue-800">
                      Aguardando resposta do cliente
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProposalManagement;