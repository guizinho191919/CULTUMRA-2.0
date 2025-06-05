
import React from 'react';
import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import EventCard from '@/components/events/EventCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { mockEvents } from '@/data/mockData';
import { Event } from '@/types';
import { Calendar, Filter, SortAsc, ChevronRight, ChevronLeft } from 'lucide-react';

const Events = () => {
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState('todos');
  const [filterDate, setFilterDate] = useState('todos');
  const [sortBy, setSortBy] = useState('date');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dateScrollRef = useRef<HTMLDivElement>(null);

  // Opções de ordenação
  const sortOptions = [
    { id: 'date', name: 'Data', icon: '📅' },
    { id: 'name', name: 'Nome A-Z', icon: '🔤' },
    { id: 'category', name: 'Categoria', icon: '🏷️' },
    { id: 'popularity', name: 'Popularidade', icon: '⭐' }
  ];
  
  const getCurrentSortOption = () => {
    return sortOptions.find(option => option.id === sortBy) || sortOptions[0];
  };

  const categories = useMemo(() => [
    { id: 'todos', name: 'Todos', icon: '📅', color: 'text-cerrado-600', count: mockEvents.length },
    { id: 'festival', name: 'Festivais', icon: '🎪', color: 'text-purple-600', count: mockEvents.filter(e => e.category === 'festival').length },
    { id: 'cultural', name: 'Cultural', icon: '🎭', color: 'text-blue-600', count: mockEvents.filter(e => e.category === 'cultural').length },
    { id: 'esportivo', name: 'Esportivo', icon: '⚽', color: 'text-green-600', count: mockEvents.filter(e => e.category === 'esportivo').length },
    { id: 'gastronomico', name: 'Gastronômico', icon: '🍽️', color: 'text-red-600', count: mockEvents.filter(e => e.category === 'gastronomico').length },
  ], []);

  const dateFilters = useMemo(() => [
    { id: 'todos', name: 'Todos os períodos', icon: '📅', color: 'text-cerrado-600' },
    { id: 'hoje', name: 'Hoje', icon: '📍', color: 'text-blue-600' },
    { id: 'semana', name: 'Esta semana', icon: '📊', color: 'text-green-600' },
    { id: 'mes', name: 'Este mês', icon: '📆', color: 'text-purple-600' },
    { id: 'futuro', name: 'Próximos eventos', icon: '🔮', color: 'text-orange-600' },
  ], []);

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

    // Aplicar ordenação
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return a.date.getTime() - b.date.getTime();
        case 'name':
          return a.title.localeCompare(b.title);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return a.date.getTime() - b.date.getTime();
      }
    });
  };

  const filteredEvents = getFilteredEvents();

  const scrollLeft = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const handleViewEvent = (event: Event) => {
    navigate(`/event/${event.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          ← Voltar
        </Button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold gradient-text mb-2 flex items-center">
            <Calendar className="w-6 h-6 mr-2" />
            Agenda Completa de Eventos
          </h1>
          <p className="text-gray-600">Descubra todos os eventos acontecendo em Mato Grosso</p>
        </div>

        {/* Filtros Bonitos */}
        <div className="space-y-4 mb-6">
          {/* Filtros por Categoria */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Filter className="h-5 w-5 text-cerrado-600" />
                Filtrar por Categoria
              </h3>
              <div className="text-sm text-gray-600">
                {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''} encontrado{filteredEvents.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full">
              {/* Botão de seta esquerda */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => scrollLeft(scrollRef)}
                className="bg-cerrado-500 hover:bg-cerrado-600 h-8 w-8 rounded-full shadow-lg flex-shrink-0 md:hidden"
              >
                <ChevronLeft className="h-4 w-4 text-white" />
              </Button>

              {/* Container dos filtros */}
              <div 
                ref={scrollRef}
                className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide flex-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={filterCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 whitespace-nowrap min-w-fit ${
                      filterCategory === category.id
                        ? 'bg-cerrado-600 hover:bg-cerrado-700 text-white shadow-lg'
                        : 'hover:bg-cerrado-50 hover:text-cerrado-700 hover:border-cerrado-300 bg-white'
                    }`}
                  >
                    <span className="text-base">{category.icon}</span>
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      filterCategory === category.id 
                        ? 'bg-white/20 text-white' 
                        : `bg-gray-100 ${category.color}`
                    }`}>
                      {category.count}
                    </span>
                  </Button>
                ))}
              </div>

              {/* Botão de seta direita */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => scrollRight(scrollRef)}
                className="bg-cerrado-500 hover:bg-cerrado-600 h-8 w-8 rounded-full shadow-lg flex-shrink-0 md:hidden"
              >
                <ChevronRight className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>

          {/* Filtros por Data */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-cerrado-600" />
                Filtrar por Data
              </h3>
            </div>
            
            <div className="flex items-center gap-2 w-full">
              {/* Botão de seta esquerda */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => scrollLeft(dateScrollRef)}
                className="bg-cerrado-500 hover:bg-cerrado-600 h-8 w-8 rounded-full shadow-lg flex-shrink-0 md:hidden"
              >
                <ChevronLeft className="h-4 w-4 text-white" />
              </Button>

              {/* Container dos filtros */}
              <div 
                ref={dateScrollRef}
                className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide flex-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {dateFilters.map((filter) => (
                  <Button
                    key={filter.id}
                    variant={filterDate === filter.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterDate(filter.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 whitespace-nowrap min-w-fit ${
                      filterDate === filter.id
                        ? 'bg-cerrado-600 hover:bg-cerrado-700 text-white shadow-lg'
                        : 'hover:bg-cerrado-50 hover:text-cerrado-700 hover:border-cerrado-300 bg-white'
                    }`}
                  >
                    <span className="text-base">{filter.icon}</span>
                    <span className="text-sm font-medium">{filter.name}</span>
                  </Button>
                ))}
              </div>

              {/* Botão de seta direita */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => scrollRight(dateScrollRef)}
                className="bg-cerrado-500 hover:bg-cerrado-600 h-8 w-8 rounded-full shadow-lg flex-shrink-0 md:hidden"
              >
                <ChevronRight className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>

          {/* Ordenação */}
          <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2">
              <SortAsc className="h-5 w-5 text-cerrado-600" />
              <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
            </div>
            
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSortOptions(!showSortOptions)}
                className="flex items-center gap-2 min-w-[160px] justify-between hover:bg-cerrado-50 hover:border-cerrado-300"
              >
                <span className="flex items-center gap-2">
                  <span>{getCurrentSortOption().icon}</span>
                  <span className="text-sm">{getCurrentSortOption().name}</span>
                </span>
                <ChevronRight className={`h-4 w-4 transition-transform ${
                  showSortOptions ? 'rotate-90' : ''
                }`} />
              </Button>
              
              {showSortOptions && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[160px]">
                  {sortOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSortBy(option.id);
                        setShowSortOptions(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-cerrado-50 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                        sortBy === option.id ? 'bg-cerrado-100 text-cerrado-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      <span>{option.icon}</span>
                      <span>{option.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="mt-8">
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
            <div className="text-center py-16">
              <div className="text-8xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Nenhum evento encontrado
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Não encontramos eventos com essas características. Tente ajustar os filtros para encontrar eventos.
              </p>
              <Button 
                onClick={() => {
                  setFilterCategory('todos');
                  setFilterDate('todos');
                }}
                className="bg-cerrado-600 hover:bg-cerrado-700"
              >
                📅 Ver Todos os Eventos
              </Button>
            </div>
          )}
        </div>

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
