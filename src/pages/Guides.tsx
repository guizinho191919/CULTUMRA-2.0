import React from 'react';
import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import GuideCard from '@/components/guides/GuideCard';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { mockGuides } from '@/data/mockData';
import { Guide } from '@/types';
import { SortAsc, ChevronRight, ChevronLeft, Filter, Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

const Guides = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('rating');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [travelDateRange, setTravelDateRange] = useState<DateRange | undefined>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sort options
  const sortOptions = [
    { id: 'rating', name: 'Melhor Avaliação', icon: '⭐' },
    { id: 'price', name: 'Preço', icon: '💰' },
    { id: 'experience', name: 'Experiência', icon: '🎯' },
    { id: 'reviews', name: 'Avaliações', icon: '💬' }
  ];
  
  const getCurrentSortOption = () => {
    return sortOptions.find(option => option.id === sortBy) || sortOptions[0];
  };

  // Categories with counters
  const categories = useMemo(() => {
    const baseCategories = [
      { id: 'todos', name: 'Todos', icon: '🧭', color: 'text-cerrado-600' },
      { id: 'trekking', name: 'Trekking', icon: '🥾', color: 'text-green-600' },
      { id: 'rapel', name: 'Rapel', icon: '🧗', color: 'text-orange-600' },
      { id: 'centro-historico', name: 'Centro Histórico', icon: '🏛️', color: 'text-purple-600' },
      { id: 'gastronomia', name: 'Gastronomia Local', icon: '🍽️', color: 'text-red-600' },
      { id: 'festas-tradicionais', name: 'Festas Tradicionais', icon: '🎭', color: 'text-pink-600' },
      { id: 'pantanal', name: 'Pantanal', icon: '🐊', color: 'text-green-600' },
      { id: 'fauna', name: 'Observação da Fauna', icon: '🦎', color: 'text-pantanal-600' },
      { id: 'pesca', name: 'Pesca Esportiva', icon: '🎣', color: 'text-blue-600' },
    ];

    return baseCategories.map(category => {
      if (category.id === 'todos') {
        return { ...category, count: mockGuides.length };
      }
      
      const count = mockGuides.filter(guide => 
        guide.specialties.some(specialty => {
          const spec = specialty.toLowerCase();
          switch (category.id) {
            case 'trekking':
              return spec.includes('trekking') || spec.includes('trilha');
            case 'rapel':
              return spec.includes('rapel') || spec.includes('escalada');
            case 'centro-historico':
              return spec.includes('histórico') || spec.includes('história');
            case 'gastronomia':
              return spec.includes('gastronomia') || spec.includes('culinária');
            case 'festas-tradicionais':
              return spec.includes('festa') || spec.includes('tradição');
            case 'pantanal':
              return spec.includes('pantanal');
            case 'fauna':
              return spec.includes('fauna') || spec.includes('observação');
            case 'pesca':
              return spec.includes('pesca');
            default:
              return false;
          }
        })
      ).length;

      return { ...category, count };
    });
  }, []);

  // Filter guides
  const filteredGuides = useMemo(() => {
    if (activeFilter === 'todos') return mockGuides;
    
    return mockGuides.filter(guide =>
      guide.specialties.some(specialty => {
        const spec = specialty.toLowerCase();
        switch (activeFilter) {
          case 'trekking':
            return spec.includes('trekking') || spec.includes('trilha');
          case 'rapel':
            return spec.includes('rapel') || spec.includes('escalada');
          case 'centro-historico':
            return spec.includes('histórico') || spec.includes('história');
          case 'gastronomia':
            return spec.includes('gastronomia') || spec.includes('culinária');
          case 'festas-tradicionais':
            return spec.includes('festa') || spec.includes('tradição');
          case 'pantanal':
            return spec.includes('pantanal');
          case 'fauna':
            return spec.includes('fauna') || spec.includes('observação');
          case 'pesca':
            return spec.includes('pesca');
          default:
            return spec.includes(activeFilter);
        }
      })
    );
  }, [activeFilter]);

  // Sort guides
  const sortedGuides = useMemo(() => {
    return [...filteredGuides].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.pricePerHour - b.pricePerHour;
        case 'experience':
          return b.experience - a.experience;
        case 'reviews':
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });
  }, [filteredGuides, sortBy]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const handleViewProfile = (guide: Guide) => {
    navigate(`/guide/${guide.id}`);
  };

  const handleStartChat = (guide: Guide) => {
    navigate(`/chat/${guide.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          ← Voltar
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2 flex items-center justify-center gap-2">
            🧭 Guias Especializados
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Encontre os melhores guias especializados em Mato Grosso
          </p>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-cerrado-600" />
                Data da Viagem
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                {travelDateRange?.from ? (
                  travelDateRange.to ? (
                    <>
                      <span className="block sm:inline">Viagem agendada de</span>
                      <span className="block sm:inline font-medium text-cerrado-700">
                        {format(travelDateRange.from, 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                      <span className="block sm:inline"> até </span>
                      <span className="block sm:inline font-medium text-cerrado-700">
                        {format(travelDateRange.to, 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="block sm:inline">Data de início:</span>
                      <span className="block sm:inline font-medium text-cerrado-700">
                        {format(travelDateRange.from, 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                      <span className="block sm:inline text-orange-600"> - Selecione data final</span>
                    </>
                  )
                ) : (
                  'Selecione o período da sua viagem'
                )}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center justify-center gap-2 w-full sm:w-auto text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2 min-h-[40px] sm:min-h-[36px]"
            >
              <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">
                {travelDateRange?.from ? (
                  travelDateRange.to ? (
                    <span className="hidden sm:inline">
                      {format(travelDateRange.from, 'dd/MM/yyyy', { locale: ptBR })} - {format(travelDateRange.to, 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  ) : (
                    <span className="hidden sm:inline">
                      {format(travelDateRange.from, 'dd/MM/yyyy', { locale: ptBR })} - Selecione data final
                    </span>
                  )
                ) : null}
                <span className="sm:hidden">
                  {travelDateRange?.from ? (
                    travelDateRange.to ? 'Período Selecionado' : 'Selecionar Data Final'
                  ) : (
                    'Selecionar Período'
                  )}
                </span>
                <span className="hidden sm:inline">
                  {!travelDateRange?.from && 'Selecionar Período'}
                </span>
              </span>
            </Button>
          </div>
          
          {showDatePicker && (
            <div className="mt-4 p-2 sm:p-0">
              <div className="flex justify-center">
                <div className="w-full max-w-sm sm:max-w-none">
                  <Calendar
                    mode="range"
                    selected={travelDateRange}
                    onSelect={(dateRange) => {
                      setTravelDateRange(dateRange);
                      if (dateRange?.from && dateRange?.to) {
                        setShowDatePicker(false);
                      }
                    }}
                    disabled={(date) => date < new Date()}
                    className="rounded-lg border bg-white shadow-sm mx-auto"
                    numberOfMonths={window.innerWidth < 640 ? 1 : 2}
                    locale={ptBR}
                    classNames={{
                      months: "flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 p-3",
                      month: "space-y-3",
                      caption: "flex justify-center pt-1 relative items-center mb-2",
                      caption_label: "text-sm font-semibold text-gray-700",
                      nav: "space-x-1 flex items-center",
                      nav_button: "h-8 w-8 bg-gray-100 hover:bg-gray-200 rounded-full p-0 transition-colors duration-200 flex items-center justify-center",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex mb-1",
                      head_cell: "text-gray-500 rounded-md w-10 h-8 font-medium text-xs flex items-center justify-center",
                      row: "flex w-full mt-1",
                      cell: "h-10 w-10 text-center text-sm p-0 relative hover:bg-gray-50 rounded-md transition-colors duration-150 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-cerrado-50 [&:has([aria-selected])]:bg-cerrado-50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                      day: "h-10 w-10 p-0 font-medium aria-selected:opacity-100 text-sm rounded-md hover:bg-gray-100 transition-colors duration-150 flex items-center justify-center",
                      day_range_end: "day-range-end",
                      day_selected: "bg-cerrado-600 text-white hover:bg-cerrado-700 focus:bg-cerrado-700 font-semibold",
                      day_today: "bg-cerrado-100 text-cerrado-800 font-semibold border border-cerrado-300",
                      day_outside: "day-outside text-gray-400 opacity-50 aria-selected:bg-cerrado-50 aria-selected:text-gray-500 aria-selected:opacity-60",
                      day_disabled: "text-gray-300 opacity-40 cursor-not-allowed",
                      day_range_middle: "aria-selected:bg-cerrado-100 aria-selected:text-cerrado-800",
                      day_hidden: "invisible",
                    }}
                  />
                </div>
              </div>
              
              {/* Botão para fechar o calendário em mobile */}
              <div className="flex justify-center mt-3 sm:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDatePicker(false)}
                  className="text-xs px-4 py-2"
                >
                  Fechar Calendário
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Filter className="h-5 w-5 text-cerrado-600" />
                Filtrar por Especialidade
              </h3>
              <div className="text-sm text-gray-600">
                {sortedGuides.length} guia{sortedGuides.length !== 1 ? 's' : ''} encontrado{sortedGuides.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full">
              <Button
                variant="ghost"
                size="icon"
                onClick={scrollLeft}
                className="bg-cerrado-500 hover:bg-cerrado-600 h-8 w-8 rounded-full shadow-lg flex-shrink-0 md:hidden"
              >
                <ChevronLeft className="h-4 w-4 text-white" />
              </Button>

              <div 
                ref={scrollRef}
                className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide flex-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={activeFilter === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 whitespace-nowrap min-w-fit ${
                      activeFilter === category.id
                        ? 'bg-cerrado-600 hover:bg-cerrado-700 text-white shadow-lg'
                        : 'hover:bg-cerrado-50 hover:text-cerrado-700 hover:border-cerrado-300 bg-white'
                    }`}
                  >
                    <span className="text-base">{category.icon}</span>
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      activeFilter === category.id 
                        ? 'bg-white/20 text-white' 
                        : `bg-gray-100 ${category.color}`
                    }`}>
                      {category.count}
                    </span>
                  </Button>
                ))}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={scrollRight}
                className="bg-cerrado-500 hover:bg-cerrado-600 h-8 w-8 rounded-full shadow-lg flex-shrink-0 md:hidden"
              >
                <ChevronRight className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>

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
        
        <div className="mt-8">
          {sortedGuides.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sortedGuides.map((guide) => (
                <GuideCard
                  key={guide.id}
                  guide={guide}
                  onViewProfile={handleViewProfile}
                  onStartChat={handleStartChat}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Nenhum guia encontrado
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Não conseguimos encontrar guias com essas características. Tente ajustar os filtros ou explorar outras especialidades.
              </p>
              <Button 
                onClick={() => setActiveFilter('todos')}
                className="bg-cerrado-600 hover:bg-cerrado-700"
              >
                🧭 Ver Todos os Guias
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Guides;