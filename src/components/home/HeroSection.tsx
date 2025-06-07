
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative h-96 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cerrado-600 via-pantanal-500 to-dourado-500">
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="text-white max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            Descubra o
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Mato Grosso
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Explore a natureza exuberante, cultura rica e aventuras únicas no coração do Brasil
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" variant="outline" className="border-white text-white bg-transparent hover:bg-white hover:text-cerrado-600 transition-colors" onClick={() => navigate('/explore')}>
              🗺️ Explore Destinos
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white bg-transparent hover:bg-white hover:text-cerrado-600 transition-colors" onClick={() => navigate('/guides')}>
              🧭 Encontre Guias
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white bg-transparent hover:bg-white hover:text-cerrado-600 transition-colors" onClick={() => navigate('/explore-food')}>
              🍽️ Experimente Comidas
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
