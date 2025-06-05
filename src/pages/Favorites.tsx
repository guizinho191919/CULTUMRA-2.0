
import { useState } from 'react';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TouristSpotCard from '@/components/spots/TouristSpotCard';
import RestaurantCard from '@/components/restaurants/RestaurantCard';
import { useFavorites } from '@/hooks/useFavorites';
import { useNavigate } from 'react-router-dom';
import { TouristSpot } from '@/types';
import { Restaurant } from '@/types/restaurant';

const Favorites = () => {
  const navigate = useNavigate();
  const { 
    favoriteSpots, 
    favoriteRestaurants, 
    clearFavorites, 
    getTotalFavorites 
  } = useFavorites();

  const totalFavorites = getTotalFavorites();

  const handleViewSpotDetails = (spot: TouristSpot) => {
    navigate(`/spot/${spot.id}`);
  };

  const handleViewRestaurantDetails = (restaurant: Restaurant) => {
    navigate(`/restaurant/${restaurant.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-4"
        >
          ← Voltar
        </Button>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold gradient-text mb-2">❤️ Meus Favoritos</h1>
              <p className="text-gray-600">
                Seus destinos e restaurantes favoritos em Mato Grosso
              </p>
            </div>
            {/* Removido o botão limpar favoritos daqui */}
          </div>

          <div className="flex items-center space-x-2 mb-6">
            <Badge variant="secondary" className="text-sm">
              {totalFavorites} {totalFavorites === 1 ? 'favorito' : 'favoritos'}
            </Badge>
          </div>
        </div>

        {totalFavorites === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">❤️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum favorito ainda
              </h3>
              <p className="text-gray-600 mb-6">
                Comece explorando destinos e restaurantes para adicionar aos seus favoritos
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => navigate('/explore')}>
                  Explorar Destinos
                </Button>
                <Button variant="outline" onClick={() => navigate('/explore-food')}>
                  Explorar Restaurantes
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Tabs defaultValue="destinos" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="destinos" className="flex items-center space-x-2">
                  <span>🗺️</span>
                  <span>Destinos ({favoriteSpots.length})</span>
                </TabsTrigger>
                <TabsTrigger value="restaurantes" className="flex items-center space-x-2">
                  <span>🍽️</span>
                  <span>Restaurantes ({favoriteRestaurants.length})</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="destinos" className="mt-6">
                {favoriteSpots.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <div className="text-4xl mb-4">🗺️</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhum destino favorito
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Explore destinos e adicione aos seus favoritos
                      </p>
                      <Button onClick={() => navigate('/explore')}>
                        Explorar Destinos
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteSpots.map((spot) => (
                      <TouristSpotCard
                        key={spot.id}
                        spot={spot}
                        onViewDetails={handleViewSpotDetails}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="restaurantes" className="mt-6">
                {favoriteRestaurants.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <div className="text-4xl mb-4">🍽️</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhum restaurante favorito
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Explore restaurantes e adicione aos seus favoritos
                      </p>
                      <Button onClick={() => navigate('/explore-food')}>
                        Explorar Restaurantes
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteRestaurants.map((restaurant) => (
                      <RestaurantCard
                        key={restaurant.id}
                        restaurant={restaurant}
                        onViewDetails={handleViewRestaurantDetails}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            {/* Botão Limpar Favoritos movido para baixo dos cards */}
            {totalFavorites > 0 && (
              <div className="mt-8 text-center">
                <Button 
                  variant="outline" 
                  onClick={clearFavorites}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Limpar Favoritos
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <Navigation />
    </div>
  );
};

export default Favorites;
