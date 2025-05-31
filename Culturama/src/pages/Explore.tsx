
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import CategoryFilter from '@/components/spots/CategoryFilter';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockTouristSpots } from '@/data/mockData';

const categories = [
  { id: 'todos', name: 'Todos', icon: '🗺️', count: mockTouristSpots.length },
  { id: 'natureza', name: 'Natureza', icon: '🌿', count: mockTouristSpots.filter(s => s.category === 'natureza').length },
  { id: 'aventura', name: 'Aventura', icon: '🏃', count: mockTouristSpots.filter(s => s.category === 'aventura').length },
  { id: 'cultura', name: 'Cultura', icon: '🎭', count: mockTouristSpots.filter(s => s.category === 'cultura').length },
  { id: 'historia', name: 'História', icon: '🏛️', count: mockTouristSpots.filter(s => s.category === 'historia').length },
];

const Explore = () => {
  const [activeCategory, setActiveCategory] = useState('todos');
  
  const filteredSpots = activeCategory === 'todos' 
    ? mockTouristSpots 
    : mockTouristSpots.filter(spot => spot.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold gradient-text mb-2">Explorar Destinos</h1>
          <p className="text-gray-600">Descubra os melhores lugares de Mato Grosso</p>
        </div>

        <div className="mb-6">
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpots.map((spot) => (
            <Card key={spot.id} className="card-hover overflow-hidden">
              <div className="relative h-48">
                <img
                  src={spot.images[0]}
                  alt={spot.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop';
                  }}
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 text-gray-800">
                    {spot.priceRange}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-white/90 px-2 py-1 rounded-full flex items-center space-x-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-medium">{spot.rating}</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{spot.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {spot.description}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">📍 {spot.location.city}</span>
                  <span className="text-sm text-gray-500">👥 {spot.reviews} avaliações</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {spot.features.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <Link to={`/spot/${spot.id}`}>
                  <Button className="w-full">Ver Detalhes</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default Explore;
