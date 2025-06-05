import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import GuideCard from '@/components/guides/GuideCard';
import GuideFilters from '@/components/guides/GuideFilters';
import { Button } from '@/components/ui/button';
import { mockGuides } from '@/data/mockData';
import { Guide } from '@/types';

const Guides = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('rating');

  // Filtrar guias
  const filteredGuides = mockGuides.filter(guide => {
    if (activeFilter === 'todos') return true;
    
    switch (activeFilter) {
      case 'pantanal':
        return guide.specialties.some(s => s.toLowerCase().includes('pantanal'));
      case 'observacao':
        return guide.specialties.some(s => 
          s.toLowerCase().includes('fauna') || 
          s.toLowerCase().includes('observação')
        );
      case 'pesca':
        return guide.specialties.some(s => s.toLowerCase().includes('pesca'));
      case 'aventura':
        return guide.specialties.some(s => 
          s.toLowerCase().includes('aventura') || 
          s.toLowerCase().includes('trilha')
        );
      case 'cultura':
        return guide.specialties.some(s => 
          s.toLowerCase().includes('cultura') || 
          s.toLowerCase().includes('história')
        );
      default:
        return true;
    }
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

        <GuideFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filteredCount={sortedGuides.length}
        />
        
        {/* Grid de Guias */}
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