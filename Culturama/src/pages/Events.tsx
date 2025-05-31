
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import EventCard from '@/components/events/EventCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { mockEvents } from '@/data/mockData';
import { Event } from '@/types';
import { Calendar, Filter } from 'lucide-react';

const Events = () => {
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState('todos');
  const [filterDate, setFilterDate] = useState('todos');

  const categories = [
    { id: 'todos', name: 'Todos', count: mockEvents.length },
    { id: 'festival', name: 'Festivais', count: mockEvents.filter(e => e.category === 'festival').length },
    { id: 'cultural', name: 'Cultural', count: mockEvents.filter(e => e.category === 'cultural').length },
    { id: 'esportivo', name: 'Esportivo', count: mockEvents.filter(e => e.category === 'esportivo').length },
    { id: 'gastronomico', name: 'Gastronômico', count: mockEvents.filter(e => e.category === 'gastronomico').length },
  ];

  const dateFilters = [
    { id: 'todos', name: 'Todos os períodos' },
    { id: 'hoje', name: 'Hoje' },
    { id: 'semana', name: 'Esta semana' },
    { id: 'mes', name: 'Este mês' },
    { id: 'futuro', name: 'Próximos eventos' },
  ];

  const getFilteredEvents = () => {
    let filtered = mockEvents;

    if (filterCategory !== 'todos') {
      filtered = filtered.filter(event => event.category === filterCategory);
    }

    if (filterDate !== 'todos') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

      switch (filterDate) {
        case 'hoje':
          filtered = filtered.filter(event => 
            event.date >= today && event.date < tomorrow
          );
          break;
        case 'semana':
          filtered = filtered.filter(event => 
            event.date >= today && event.date <= weekFromNow
          );
          break;
        case 'mes':
          filtered = filtered.filter(event => 
            event.date >= today && event.date <= monthFromNow
          );
          break;
        case 'futuro':
          filtered = filtered.filter(event => event.date > now);
          break;
      }
    }

    return filtered.sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const filteredEvents = getFilteredEvents();

  const handleViewEvent = (event: Event) => {
    navigate(`/event/${event.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold gradient-text mb-2 flex items-center">
            <Calendar className="w-6 h-6 mr-2" />
            Agenda Completa de Eventos
          </h1>
          <p className="text-gray-600">Descubra todos os eventos acontecendo em Mato Grosso</p>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-6">
          {/* Category Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <Filter className="w-4 h-4 mr-2" />
                <span className="font-medium">Filtrar por categoria</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={filterCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterCategory(category.id)}
                    className="text-xs"
                  >
                    {category.name} ({category.count})
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Date Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="font-medium">Filtrar por data</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {dateFilters.map((filter) => (
                  <Button
                    key={filter.id}
                    variant={filterDate === filter.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterDate(filter.id)}
                    className="text-xs"
                  >
                    {filter.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Mostrando {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''} 
            {filterCategory !== 'todos' && ` na categoria "${categories.find(c => c.id === filterCategory)?.name}"`}
            {filterDate !== 'todos' && ` para "${dateFilters.find(d => d.id === filterDate)?.name}"`}
          </p>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onViewDetails={handleViewEvent}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum evento encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                Tente ajustar os filtros para encontrar eventos
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setFilterCategory('todos');
                  setFilterDate('todos');
                }}
              >
                Limpar filtros
              </Button>
            </CardContent>
          </Card>
        )}

        {/* CTA Section */}
        {filteredEvents.length > 0 && (
          <Card className="mt-12">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-bold mb-2">Não encontrou o que procura?</h3>
              <p className="text-gray-600 mb-4">
                Conecte-se com guias locais para descobrir eventos exclusivos
              </p>
              <Button onClick={() => navigate('/search')}>
                Encontrar Guias
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      <Navigation />
    </div>
  );
};

export default Events;
