
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', label: 'Início', icon: '🏠', path: '/' },
    { id: 'explorar', label: 'Explorar', icon: '🗺️', path: '/explore' },
    { id: 'buscar', label: 'Buscar', icon: '🔍', path: '/search' },
    { id: 'eventos', label: 'Eventos', icon: '🎉', path: '/events' },
    { id: 'notificacoes', label: 'Avisos', icon: '💬', badge: 3, path: '/notifications' },
  ];

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/explore') return 'explorar';
    if (path === '/search') return 'buscar';
    if (path === '/events') return 'eventos';
    if (path === '/notifications') return 'notificacoes';
    return 'home';
  };

  const activeTab = getActiveTab();

  const handleNavigation = (item: typeof navItems[0]) => {
    navigate(item.path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-50 md:hidden">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item)}
            className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
              activeTab === item.id
                ? 'text-cerrado-600 bg-cerrado-50'
                : 'text-gray-500 hover:text-cerrado-600'
            }`}
          >
            <div className="relative">
              <span className="text-xl">{item.icon}</span>
              {item.badge && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs bg-red-500">
                  {item.badge}
                </Badge>
              )}
            </div>
            <span className="text-xs mt-1 font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
