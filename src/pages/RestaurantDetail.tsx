import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockRestaurants } from '@/data/mockRestaurants';
import { Clock, Calendar, Users, CreditCard, Smartphone, Shield, Star } from 'lucide-react';
import { getCuisineIcon, getCuisineColor } from '@/utils/cuisineUtils';
import { useFavorites } from '@/hooks/useFavorites';
import { useBackpack } from '@/hooks/useBackpack';
import RestaurantActionButtons from '@/components/restaurants/RestaurantActionButtons';
import { useCallback } from 'react';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addRestaurantToFavorites, removeRestaurantFromFavorites, isRestaurantFavorite } = useFavorites();
  const { addRestaurantToBackpack, isRestaurantInBackpack } = useBackpack();
  
  const restaurant = mockRestaurants.find(r => r.id === id);
  const isFavorite = restaurant ? isRestaurantFavorite(restaurant.id) : false;
  const inBackpack = restaurant ? isRestaurantInBackpack(restaurant.id) : false;

  const handleFavoriteClick = useCallback(() => {
    if (!restaurant) return;
    
    if (isFavorite) {
      removeRestaurantFromFavorites(restaurant.id);
    } else {
      addRestaurantToFavorites(restaurant);
    }
  }, [isFavorite, restaurant, addRestaurantToFavorites, removeRestaurantFromFavorites]);

  const handleAddToBackpack = () => {
    if (restaurant) {
      addRestaurantToBackpack(restaurant);
    }
  };

  const handleShareRestaurant = () => {
    if (!restaurant) return;
    
    if (navigator.share) {
      navigator.share({
        title: restaurant.name,
        text: restaurant.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  const getPriceEstimate = () => {
    if (!restaurant) return 0;
    const prices = {
      '$': 25,
      '$$': 45,
      '$$$': 85,
      '$$$$': 150
    };
    return prices[restaurant.priceRange as keyof typeof prices] || 50;
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6 pb-20">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Restaurante não encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                O restaurante que você procura não existe ou foi removido.
              </p>
              <Button onClick={() => navigate('/explore-food')}>
                Explorar Restaurantes
              </Button>
            </CardContent>
          </Card>
        </main>
        <Navigation />
      </div>
    );
  }

  const getRestaurantInfo = () => {
    return {
      cashback: '2.5% de cashback',
      cashbackDesc: 'Dinheiro de volta para usar no MatoGrossoGuide',
      duration: '2h',
      startTime: restaurant.openingHours?.open || '11:00h',
      days: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      cancellation: 'Cancelamento da reserva até 2h antes',
      voucher: 'Reserva digital',
      voucherDesc: 'Confirme sua mesa pelo app',
      chef: 'Chef especializado',
      chefDesc: 'Culinária autêntica com ingredientes locais',
      overview: `Desfrute da autêntica culinária ${restaurant.cuisine} no ${restaurant.name}. Uma experiência gastronômica única que combina sabores tradicionais com ingredientes frescos de Mato Grosso, em um ambiente acolhedor e familiar.`
    };
  };

  const info = getRestaurantInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          ← Voltar
        </Button>

        {/* Restaurant Image */}
        <Card className="mb-6 overflow-hidden">
          <div className="relative h-64 md:h-80">
            <img
              src={restaurant.images[0]}
              alt={restaurant.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Badge de categoria */}
            <div className="absolute top-4 left-4">
              <Badge className={`${getCuisineColor(restaurant.cuisine)} border-0 text-sm flex items-center gap-2`}>
                <span>{getCuisineIcon(restaurant.cuisine)}</span>
                <span>{restaurant.cuisine.charAt(0).toUpperCase() + restaurant.cuisine.slice(1)}</span>
              </Badge>
            </div>

            {/* Rating */}
            <div className="absolute top-4 right-4">
              <div className="bg-white/95 px-3 py-2 rounded-full flex items-center space-x-2 shadow-sm">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-gray-800">{restaurant.rating}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Restaurant Info */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl gradient-text">{restaurant.name}</CardTitle>
                <p className="text-gray-600 mt-1">📍 {restaurant.location.city}, {restaurant.location.state}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShareRestaurant}
                className="min-w-[120px]"
              >
                📤 Compartilhar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{restaurant.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <span>💰</span>
                <span>Faixa: {restaurant.priceRange}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>⭐</span>
                <span>Avaliação: {restaurant.rating}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📍</span>
                <span>{restaurant.location.city}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-cerrado-700">Informações da Reserva</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Cashback */}
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-700">{info.cashback}</h4>
                <p className="text-sm text-gray-600">{info.cashbackDesc}</p>
              </div>
            </div>

            {/* Horário e Funcionamento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-700">Tempo médio: {info.duration}</h4>
                  <p className="text-sm text-gray-600">Abertura às {info.startTime}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-purple-700">Funcionamento</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {info.days.map((day, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {day}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Cancelamento e Reserva */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-red-700">Cancelamento fácil</h4>
                  <p className="text-sm text-gray-600">{info.cancellation}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <Smartphone className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-indigo-700">{info.voucher}</h4>
                  <p className="text-sm text-gray-600">{info.voucherDesc}</p>
                </div>
              </div>
            </div>

            {/* Chef */}
            <div className="flex items-start space-x-3">
              <div className="bg-teal-100 p-2 rounded-full">
                <Users className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <h4 className="font-semibold text-teal-700">{info.chef}</h4>
                <p className="text-sm text-gray-600">{info.chefDesc}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visão Geral */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-cerrado-700">Sobre o Restaurante</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{info.overview}</p>
          </CardContent>
        </Card>

        {/* Restaurant Action Buttons */}
        <RestaurantActionButtons 
          restaurant={restaurant}
          inBackpack={inBackpack}
          onAddToBackpack={handleAddToBackpack}
          getPriceEstimate={getPriceEstimate}
          isFavorite={isFavorite}
          onToggleFavorite={handleFavoriteClick}
        />
      </main>

      <Navigation />
    </div>
  );
};

export default RestaurantDetail;
