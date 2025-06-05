
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, Plus, Search, Filter, Eye, Edit, 
  MapPin, Clock, Users, Star, Ticket 
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  maxParticipants: number;
  currentParticipants: number;
  category: 'cultural' | 'adventure' | 'gastronomy' | 'music' | 'sports';
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  featuredUntil?: string;
  organizer: string;
  rating: number;
  reviewsCount: number;
  createdAt: string;
  tags: string[];
}

const EventsManagement = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, statusFilter, categoryFilter]);

  const loadEvents = () => {
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Festival de Inverno de Bonito',
        description: 'Festival cultural com música, gastronomia e artesanato local.',
        location: 'Bonito, MS',
        date: '2024-07-15',
        time: '18:00',
        duration: '3 dias',
        price: 80,
        maxParticipants: 500,
        currentParticipants: 320,
        category: 'cultural',
        status: 'published',
        featuredUntil: '2024-06-30',
        organizer: 'Prefeitura de Bonito',
        rating: 4.7,
        reviewsCount: 45,
        createdAt: '2024-04-01',
        tags: ['música', 'gastronomia', 'cultura']
      },
      {
        id: '2',
        title: 'Encontro de Observação de Aves',
        description: 'Evento para observação e fotografia de aves no Pantanal.',
        location: 'Pantanal, MT',
        date: '2024-06-20',
        time: '06:00',
        duration: '1 dia',
        price: 150,
        maxParticipants: 30,
        currentParticipants: 18,
        category: 'adventure',
        status: 'published',
        organizer: 'Instituto Pantanal',
        rating: 4.9,
        reviewsCount: 12,
        createdAt: '2024-05-10',
        tags: ['aves', 'fotografia', 'natureza']
      }
    ];
    setEvents(mockEvents);
  };

  const filterEvents = () => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(event => event.category === categoryFilter);
    }

    setFilteredEvents(filtered);
  };

  const toggleFeatured = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { 
            ...event, 
            featuredUntil: event.featuredUntil 
              ? undefined 
              : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          } 
        : event
    ));
    toast({
      title: "Destaque atualizado",
      description: "Status de destaque do evento foi atualizado."
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-700';
      case 'draft': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cultural': return 'bg-purple-100 text-purple-700';
      case 'adventure': return 'bg-green-100 text-green-700';
      case 'gastronomy': return 'bg-orange-100 text-orange-700';
      case 'music': return 'bg-pink-100 text-pink-700';
      case 'sports': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Gestão de Eventos</h1>
          <p className="text-gray-600">Gerencie eventos, aprovações e destaques</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Novo Evento</span>
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{events.filter(e => e.status === 'published').length}</p>
              <p className="text-sm text-gray-600">Publicados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{events.filter(e => e.status === 'draft').length}</p>
              <p className="text-sm text-gray-600">Rascunhos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{events.filter(e => e.featuredUntil).length}</p>
              <p className="text-sm text-gray-600">Em Destaque</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{events.reduce((sum, e) => sum + e.currentParticipants, 0)}</p>
              <p className="text-sm text-gray-600">Participantes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">R$ {events.reduce((sum, e) => sum + (e.price * e.currentParticipants), 0).toLocaleString()}</p>
              <p className="text-sm text-gray-600">Receita</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="published">Publicados</SelectItem>
                <SelectItem value="draft">Rascunhos</SelectItem>
                <SelectItem value="cancelled">Cancelados</SelectItem>
                <SelectItem value="completed">Concluídos</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
                <SelectItem value="adventure">Aventura</SelectItem>
                <SelectItem value="gastronomy">Gastronomia</SelectItem>
                <SelectItem value="music">Música</SelectItem>
                <SelectItem value="sports">Esportes</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filtros</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Eventos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      {event.featuredUntil && (
                        <Badge className="bg-yellow-100 text-yellow-700">
                          ⭐ Destaque
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(event.status)}>
                      {event.status === 'published' ? 'Publicado' : 
                       event.status === 'draft' ? 'Rascunho' :
                       event.status === 'cancelled' ? 'Cancelado' : 'Concluído'}
                    </Badge>
                    <Badge className={getCategoryColor(event.category)}>
                      {event.category === 'cultural' ? 'Cultural' :
                       event.category === 'adventure' ? 'Aventura' :
                       event.category === 'gastronomy' ? 'Gastronomia' :
                       event.category === 'music' ? 'Música' : 'Esportes'}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl text-green-600">R$ {event.price}</p>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm">{event.rating} ({event.reviewsCount})</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{event.currentParticipants}/{event.maxParticipants} participantes</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {event.organizer}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    <p>Duração: {event.duration}</p>
                    <p>Criado: {new Date(event.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedEvent(event)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Detalhes do Evento</DialogTitle>
                        </DialogHeader>
                        {selectedEvent && (
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-semibold text-lg">{selectedEvent.title}</h3>
                              <p className="text-gray-600">{selectedEvent.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="font-medium">Local:</label>
                                <p>{selectedEvent.location}</p>
                              </div>
                              <div>
                                <label className="font-medium">Data:</label>
                                <p>{new Date(selectedEvent.date).toLocaleDateString()} às {selectedEvent.time}</p>
                              </div>
                              <div>
                                <label className="font-medium">Preço:</label>
                                <p>R$ {selectedEvent.price}</p>
                              </div>
                              <div>
                                <label className="font-medium">Duração:</label>
                                <p>{selectedEvent.duration}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleFeatured(event.id)}
                    >
                      ⭐
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
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

export default EventsManagement;
