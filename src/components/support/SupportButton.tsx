
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Headphones } from 'lucide-react';

const SupportButton = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const handleSupportClick = () => {
    navigate('/support');
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 right-4 z-40 md:bottom-6">
      <div className="relative group">
        {/* Efeito de pulso - movido para trás */}
        <div className="absolute inset-0 rounded-full bg-cerrado-500/20 animate-ping -z-10"></div>
        
        <Button
          onClick={handleSupportClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative bg-gradient-to-r from-cerrado-500 to-cerrado-600 hover:from-cerrado-600 hover:to-cerrado-700 text-white rounded-full w-16 h-16 shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl border-2 border-white/20 z-10"
          size="icon"
        >
          <Headphones className={`w-7 h-7 transition-all duration-300 ${isHovered ? 'scale-110' : ''}`} />
        </Button>
        
        {/* Close button - com z-index maior */}
        <button
          onClick={handleClose}
          className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-all duration-200 hover:scale-110 shadow-md z-20"
        >
          <X className="w-3 h-3" />
        </button>
        
        {/* Indicador online - separado do ícone principal */}
        <div className="absolute top-1 right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse z-15 border border-white"></div>
        
        {/* Tooltip melhorado */}
        <div className="absolute bottom-20 right-0 bg-gray-900/95 backdrop-blur-sm text-white text-sm px-4 py-3 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none shadow-xl border border-white/10 z-30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-medium">Suporte Online</span>
          </div>
          <p className="text-xs text-gray-300 mt-1">Estamos aqui para ajudar!</p>
          <div className="absolute top-full right-6 border-4 border-transparent border-t-gray-900/95"></div>
        </div>
      </div>
    </div>
  );
};

export default SupportButton;
