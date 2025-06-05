import React from 'react';
import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import GuideCard from '@/components/guides/GuideCard';
import { Button } from '@/components/ui/button';
import { mockGuides } from '@/data/mockData';
import { Guide } from '@/types';
import { SortAsc, ChevronRight, ChevronLeft, Filter } from 'lucide-react';

const Guides = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('rating');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Opções de ordenação
  const sortOptions = [
    { id: 'rating', name: 'Melhor Avaliação', icon: '⭐' },
    { id: 'price', name: 'Preço', icon: '💰' },
    { id: 'experience', name: 'Experiência', icon: '🎯' },
    { id: 'reviews', name: 'Avaliações', icon: '💬' }
  ];
  
  const getCurrentSortOption = () => {
    return sortOptions.find(option => option.id === sortBy) || sortOptions[0];
  };

  // Categorias de especialidades com contadores
  const categories = useMemo(() => {
    const baseCategories = [
      { id: 'todos', name: 'Todos', icon: '🧭', color: 'text-cerrado-600' },
      { id: 'trekking', name: 'Trekking', icon: '🥾', color: 'text-green-600' },
      { id: 'rapel', name: 'Rapel', icon: '🧗', color: 'text-orange-600' },
      { id: 'centro-historico', name: 'Centro Histórico', icon: '🏛️', color: 'text-purple-600' },
      { id: 'gastronomia', name: 'Gastronomia Local', icon: '🍽️', color: 'text-red-600' },
      { id: 'festas-tradicionais', name: 'Festas Tradicionais', icon: '🎭', color: 'text-pink-600' },
      { id: 'pantanal', name: 'Pantanal', icon: '🐊', color: 'text-green-600' },
      { id: 'fauna', name: 'Observação de Fauna', icon: '🦎', color: 'text-pantanal-600' },
      { id: 'pesca', name: 'Pesca Esportiva', icon: '🎣', color: 'text-blue-600' },
    ];

    return baseCategories.map(category => {
      if (category.id === 'todos') {
        return { ...category, count: mockGuides.length };
      }
      
      let count = 0;
      switch (category.id) {
        case 'trekking':
          count = mockGuides.filter(guide => 
            guide.specialties.some(s => s.toLowerCase().includes('trekking') || s.toLowerCase().includes('trilha'))
          ).length;
          break;
        case 'rapel':
          count = mockGuides.filter(guide => 
            guide.specialties.some(s => s.toLowerCase().includes('rapel') || s.toLowerCase().includes('escalada'))
          ).length;
          break;
        case 'centro-historico':
          count = mockGuides.filter(guide => 
            guide.specialties.some(s => s.toLowerCase().includes('histórico') || s.toLowerCase().includes('história'))
          ).length;
          break;
        case 'gastronomia':
          count = mockGuides.filter(guide => 
            guide.specialties.some(s => s.toLowerCase().includes('gastronomia') || s.toLowerCase().includes('culinária'))
          ).length;
          break;
        case 'festas-tradicionais':
          count = mockGuides.filter(guide => 
            guide.specialties.some(s => s.toLowerCase().includes('festa') || s.toLowerCase().includes('tradição'))
          ).length;
          break;
        case 'pantanal':
          count = mockGuides.filter(guide => 
            guide.specialties.some(s => s.toLowerCase().includes('pantanal'))
          ).length;
          break;
        case 'fauna':
          count = mockGuides.filter(guide => 
            guide.specialties.some(s => 
              s.toLowerCase().includes('fauna') || 
              s.toLowerCase().includes('observação')
            )
          ).length;
          break;
        case 'pesca':
          count = mockGuides.filter(guide => 
            guide.specialties.some(s => s.toLowerCase().includes('pesca'))
          ).length;
          break;
      }
      return { ...category, count };
    });
  }, []);

  // Filtrar guias
  const filteredGuides = mockGuides.filter(guide => {
    if (activeFilter === 'todos') return true;
    
    return guide.specialties.some(specialty => {
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
    });
  });

  // Ordenar guias
  const sortedGuides = [...filteredGuides].sort((a, b) => {
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
      
      <main className="container mx-auto px-4 py-6 pb-20">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          ← Voltar
        </Button>

        {/* Título da Página */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2 flex items-center justify-center gap-2">
            🧭 Guias Especializados
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Encontre os melhores guias especializados de Mato Grosso
          </p>
        </div>

        {/* Filtros Bonitos */}
        <div className="space-y-4 mb-6">
          {/* Filtros por Especialidade */}
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
              {/* Botão de seta esquerda */}
              <Button
                variant="ghost"
                size="icon"
                onClick={scrollLeft}
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

              {/* Botão de seta direita */}
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
                Não encontramos guias com essas características. Tente ajustar os filtros ou explorar outras especialidades.
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
      
      <Navigation />
    </div>
  );
};

export default Guides;