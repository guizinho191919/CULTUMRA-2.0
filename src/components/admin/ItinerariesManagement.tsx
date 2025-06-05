
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Map, Plus, Search, Filter, Eye, Edit, 
  Check, X, Star, MapPin, Calendar, Users 
} from 'lucide-react';

interface Itinerary {
  id: string;
  title: string;
  description: string;
  guideName: string;
  guideId: string;
  location: string;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  price: number;
  maxParticipants: number;
  currentBookings: number;
  rating: number;
  reviewsCount: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'inactive';
  featuredUntil?: string;
  createdAt: string;
  tags: string[];
  images: string[];
}

const ItinerariesManagement = () => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [filteredItineraries, setFilteredItineraries] = useState<Itinerary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadItineraries();
  }, []);

  useEffect(() => {
    filterItineraries();
  }, [itineraries, searchTerm, statusFilter]);

  const loadItineraries = () => {
    const mockItineraries: Itinerary[] = [
      {
        id: '1',
        title: 'Pantanal Adventure - 3 Dias',
        description: 'Uma aventura incrível pelo Pantanal com observação de fauna e flora.',
        guideName: 'João Silva',
        guideId: '1',
        location: 'Pantanal, MT',
        duration: '3 dias',
        difficulty: 'medium',
        price: 450,
        maxParticipants: 8,
        currentBookings: 5,
        rating: 4.8,
        reviewsCount: 24,
        status: 'approved',
        featuredUntil: '2024-06-30',
        createdAt: '2024-04-01',
        tags: ['natureza', 'fauna', 'fotografia'],
        images: ['/api/placeholder/400/300']
      },
      {
        id: '2',
        title: 'Chapada dos Guimarães Trilha',
        description: 'Trilha pelas cachoeiras mais belas da Chapada dos Guimarães.',
        guideName: 'Maria Santos',
        guideId: '2',
        location: 'Chapada dos Guimarães, MT',
        duration: '1 dia',
        difficulty: 'easy',
        price: 120,
        maxParticipants: 12,
        currentBookings: 8,
        rating: 4.6,
        reviewsCount: 18,
        status: 'pending',
        createdAt: '2024-05-15',
        tags: ['cachoeiras', 'trilha', 'família'],
        images: ['/api/placeholder/400/300']
      }
    ];
    setItineraries(mockItineraries);
  };

  const filterItineraries = () => {
    let filtered = itineraries;

    if (searchTerm) {
      filtered = filtered.filter(itinerary => 
        itinerary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        itinerary.guideName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        itinerary.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(itinerary => itinerary.status === statusFilter);
    }

    setFilteredItineraries(filtered);
  };

  const handleStatusChange = (itineraryId: string, newStatus: 'approved' | 'rejected') => {
    setItineraries(prev => prev.map(itinerary => 
      itinerary.id === itineraryId ? { ...itinerary, status: newStatus } : itinerary
    ));
    toast({
      title: "Status atualizado",
      description: `Roteiro ${newStatus === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso.`
    });
  };

  const toggleFeatured = (itineraryId: string) => {
    setItineraries(prev => prev.map(itinerary => 
      itinerary.id === itineraryId 
        ? { 
            ...itinerary, 
            featuredUntil: itinerary.featuredUntil 
              ? undefined 
              : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          } 
        : itinerary
    ));
    toast({
      title: "Destaque atualizado",
      description: "Status de destaque do roteiro foi atualizado."
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      case 'draft': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Gestão de Roteiros</h1>
          <p className="text-gray-600">Gerencie roteiros, aprovações e destaques</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Novo Roteiro</span>
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{itineraries.filter(i => i.status === 'approved').length}</p>
              <p className="text-sm text-gray-600">Aprovados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{itineraries.filter(i => i.status === 'pending').length}</p>
              <p className="text-sm text-gray-600">Pendentes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{itineraries.filter(i => i.featuredUntil).length}</p>
              <p className="text-sm text-gray-600">Em Destaque</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{itineraries.reduce((sum, i) => sum + i.currentBookings, 0)}</p>
              <p className="text-sm text-gray-600">Reservas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">R$ {itineraries.reduce((sum, i) => sum + (i.price * i.currentBookings), 0).toLocaleString()}</p>
              <p className="text-sm text-gray-600">Receita</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar roteiros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="approved">Aprovados</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="rejected">Rejeitados</SelectItem>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filtros Avançados</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Roteiros */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredItineraries.map((itinerary) => (
          <Card key={itinerary.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{itinerary.title}</h3>
                      {itinerary.featuredUntil && (
                        <Badge className="bg-yellow-100 text-yellow-700">
                          ⭐ Destaque
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{itinerary.location}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{itinerary.duration}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{itinerary.currentBookings}/{itinerary.maxParticipants}</span>
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{itinerary.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(itinerary.status)}>
                      {itinerary.status === 'approved' ? 'Aprovado' : 
                       itinerary.status === 'pending' ? 'Pendente' :
                       itinerary.status === 'rejected' ? 'Rejeitado' :
                       itinerary.status === 'draft' ? 'Rascunho' : 'Inativo'}
                    </Badge>
                    <Badge className={getDifficultyColor(itinerary.difficulty)}>
                      {itinerary.difficulty === 'easy' ? 'Fácil' :
                       itinerary.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl text-green-600">R$ {itinerary.price}</p>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm">{itinerary.rating} ({itinerary.reviewsCount})</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    <p>Guia: <span className="font-medium">{itinerary.guideName}</span></p>
                    <p>Criado: {new Date(itinerary.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedItinerary(itinerary)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Detalhes do Roteiro</DialogTitle>
                        </DialogHeader>
                        {selectedItinerary && (
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-semibold text-lg">{selectedItinerary.title}</h3>
                              <p className="text-gray-600">{selectedItinerary.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="font-medium">Localização:</label>
                                <p>{selectedItinerary.location}</p>
                              </div>
                              <div>
                                <label className="font-medium">Duração:</label>
                                <p>{selectedItinerary.duration}</p>
                              </div>
                              <div>
                                <label className="font-medium">Preço:</label>
                                <p>R$ {selectedItinerary.price}</p>
                              </div>
                              <div>
                                <label className="font-medium">Participantes:</label>
                                <p>{selectedItinerary.currentBookings}/{selectedItinerary.maxParticipants}</p>
                              </div>
                            </div>
                            <div>
                              <label className="font-medium">Tags:</label>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {selectedItinerary.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline">{tag}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleFeatured(itinerary.id)}
                    >
                      ⭐
                    </Button>
                    
                    {itinerary.status === 'pending' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusChange(itinerary.id, 'approved')}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusChange(itinerary.id, 'rejected')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ItinerariesManagement;
