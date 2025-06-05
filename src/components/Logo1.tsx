import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Map, Briefcase, Utensils, Mountain } from 'lucide-react';

interface Logo1Props {
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'green' | 'blue' | 'red' | 'purple' | 'default';
}

const Logo1 = ({ showText = true, size = 'md', color = 'green' }: Logo1Props) => {
  // Tamanhos para o círculo do logo (reduzidos)
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  };

  // Tamanhos para o texto (aumentados)
  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  // Tamanhos para os ícones (reduzidos)
  const iconSizes = {
    sm: { center: 8, cardinal: 6 },
    md: { center: 12, cardinal: 8 },
    lg: { center: 16, cardinal: 10 }
  };

  // Gradientes para o fundo do logo
  const bgGradients = {
    green: 'bg-gradient-to-br from-cerrado-500 to-pantanal-500',
    blue: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    red: 'bg-gradient-to-br from-red-500 to-orange-500',
    purple: 'bg-gradient-to-br from-purple-500 to-pink-500',
    default: 'bg-gradient-to-br from-cerrado-500 to-pantanal-500'
  };

  // Gradientes para o texto
  const textGradients = {
    green: 'from-cerrado-500 to-pantanal-500',
    blue: 'from-blue-500 to-cyan-500',
    red: 'from-red-500 to-orange-500',
    purple: 'from-purple-500 to-pink-500',
    default: 'from-cerrado-500 to-pantanal-500'
  };

  // Layout com bússola no centro e ícones nos pontos cardeais
  const renderIconLayout = () => {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Bússola no centro */}
        <Compass 
          size={iconSizes[size].center} 
          className="text-white z-10" 
          strokeWidth={2}
        />
        
        {/* Ícones nos pontos cardeais */}
        {/* Norte - Montanha */}
        <Mountain 
          size={iconSizes[size].cardinal} 
          className="absolute top-1 left-1/2 transform -translate-x-1/2 text-white/80" 
          strokeWidth={2}
        />
        
        {/* Sul - Mala/Bagagem */}
        <Briefcase 
          size={iconSizes[size].cardinal} 
          className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-white/80" 
          strokeWidth={2}
        />
        
        {/* Leste - Mapa */}
        <Map 
          size={iconSizes[size].cardinal} 
          className="absolute right-1 top-1/2 transform -translate-y-1/2 text-white/80" 
          strokeWidth={2}
        />
        
        {/* Oeste - Talher */}
        <Utensils 
          size={iconSizes[size].cardinal} 
          className="absolute left-1 top-1/2 transform -translate-y-1/2 text-white/80" 
          strokeWidth={2}
        />
      </div>
    );
  };

  return (
    <Link to="/" className="flex items-center space-x-3">
      <div className={`${sizeClasses[size]} ${bgGradients[color]} rounded-full flex items-center justify-center relative overflow-hidden`}>
        {renderIconLayout()}
      </div>
      {showText && (
        <h1 className={`font-bold ${textSizeClasses[size]} bg-gradient-to-r ${textGradients[color]} text-transparent bg-clip-text`}>
          Culturando
        </h1>
      )}
    </Link>
  );
};

export default Logo1;