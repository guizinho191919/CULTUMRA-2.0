
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  // Itens de navegação padrão
  const navItems = [
    { id: 'home', label: 'Início', icon: '🏠', path: '/' },
    { id: 'explorar', label: 'Destinos', icon: '🗺️', path: '/explore' },
    { id: 'comidas', label: 'Comidas', icon: '🍽️', path: '/explore-food' },
    { id: 'buscar', label: 'Buscar', icon: '🔍', path: '/search' },
    { id: 'chats', label: 'Mensagens', icon: '💬', badge: 3, path: '/chats' },
  ];

  // Adicionar itens de navegação específicos para cada tipo de usuário
  const getNavItems = () => {
    if (!isAuthenticated || !user) return navItems;
    
    let items = [...navItems];
    
    if (user.userType === 'admin') {
      items.push({ id: 'admin', label: 'Admin', icon: '🔧', path: '/admin' });
    } else if (user.userType === 'guide') {
      items.push({ id: 'guide', label: 'Dashboard', icon: '🧭', path: '/dashboard/guide' });
    } else if (user.userType === 'restaurant') {
      items.push({ id: 'restaurant', label: 'Dashboard', icon: '🍽️', path: '/dashboard/restaurant' });
    }
    
    return items;
  };

  const currentNavItems = getNavItems();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/explore') return 'explorar';
    if (path === '/explore-food') return 'comidas';
    if (path === '/search') return 'buscar';
    if (path === '/chats') return 'chats';
    if (path.startsWith('/admin')) return 'admin';
    if (path.startsWith('/dashboard/guide')) return 'guide';
    if (path.startsWith('/dashboard/restaurant')) return 'restaurant';
    return 'home';
  };

  const activeTab = getActiveTab();

  const handleNavigation = (item: typeof navItems[0]) => {
    // Verificar se precisa de autenticação
    if (item.id === 'chats' && !isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(item.path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-50 md:hidden">
      <div className="flex justify-around items-center py-2">
        {currentNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item)}
            className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
              activeTab === item.id
                ? 'text-cerrado-600 bg-cerrado-50'
                : 'text-gray-500 hover:text-cerrado-600'
            } ${
              item.id === 'chats' && !isAuthenticated ? 'opacity-50' : ''
            }`}
          >
            <div className="relative">
              <span className="text-xl">{item.icon}</span>
              {item.badge && isAuthenticated && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center text-[10px] bg-red-500 text-white p-0 border-white border">
                  {item.badge}
                </Badge>
              )}
            </div>
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
