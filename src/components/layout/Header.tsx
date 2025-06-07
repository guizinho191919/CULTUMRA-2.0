
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useBackpack } from '@/hooks/useBackpack';
import { useWallet } from '@/hooks/useWallet';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAdmin } from '@/hooks/useAdmin';
import { useIsMobile } from '@/hooks/use-mobile';
import { Backpack, Wallet, Bell, Heart, Search, X } from 'lucide-react';
import Logo1 from '@/components/Logo1';

const Header = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { getTotalItems } = useBackpack();
  const { balance } = useWallet();
  const { user, isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();
  const { currentUser } = useAdmin();
  const isMobile = useIsMobile();

  const totalItems = getTotalItems();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  const handleCloseSearch = () => {
    setSearchTerm('');
    setIsSearchFocused(false);
  };

  const isAdmin = currentUser?.role === 'admin' || currentUser?.permissions.includes('*');
  const isSearchExpanded = isMobile && isSearchFocused;
  const showSearchIcon = (!searchTerm && !isSearchFocused) || isSearchExpanded;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {!isSearchExpanded && (
            <Logo1 showText={!isMobile} />
          )}

          <div className={`transition-all duration-300 ${
            isSearchExpanded 
              ? 'flex-1 absolute left-4 right-4 z-50' 
              : 'flex-1 max-w-md mx-4'
          }`}>
            <form onSubmit={handleSearch} className="relative">
              <Input
                placeholder="Buscar destinos, guias, eventos..."
                className={`transition-all duration-200 ${showSearchIcon ? 'pl-10' : 'pl-3'} ${isSearchExpanded ? 'pr-10' : 'pr-3'}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
              />
              
              {showSearchIcon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Search className="h-4 w-4" />
                </div>
              )}
              
              {isSearchExpanded && (
                <button
                  type="button"
                  onClick={handleCloseSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>
          </div>

          {!isSearchExpanded && (
            <div className="flex items-center space-x-3">
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm" className="bg-gradient-to-r from-cerrado-500 to-pantanal-500 text-white hover:from-cerrado-600 hover:to-pantanal-600 h-9 px-3">
                    Admin
                  </Button>
                </Link>
              )}
              
              {isAuthenticated ? (
                <Link to="/backpack">
                  <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
                    <Backpack className="h-5 w-5" />
                    {totalItems > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center text-[10px] bg-cerrado-500 p-0 border-white border">
                        {totalItems}
                      </Badge>
                    )}
                  </Button>
                </Link>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative h-9 w-9 p-0 opacity-50 cursor-not-allowed"
                  onClick={() => navigate('/login')}
                >
                  <Backpack className="h-5 w-5" />
                </Button>
              )}
              
              {isAuthenticated ? (
                <Link to="/wallet">
                  <Button variant="ghost" size="sm" className="relative flex items-center space-x-1 h-9 px-2">
                    <Wallet className="h-5 w-5" />
                    <span className="hidden sm:inline text-xs font-medium">
                      R$ {balance.toFixed(0)}
                    </span>
                  </Button>
                </Link>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative flex items-center space-x-1 h-9 px-2 opacity-50 cursor-not-allowed"
                  onClick={() => navigate('/login')}
                >
                  <Wallet className="h-5 w-5" />
                  <span className="hidden sm:inline text-xs font-medium">R$ 0</span>
                </Button>
              )}
              
              {isAuthenticated ? (
                <Link to="/notifications">
                  <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center text-[10px] bg-red-500 text-white p-0 border-white border">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative h-9 w-9 p-0 opacity-50 cursor-not-allowed"
                  onClick={() => navigate('/login')}
                >
                  <Bell className="h-5 w-5" />
                </Button>
              )}
              
              {isAuthenticated ? (
                <Link to="/favorites">
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                    <Heart className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-9 w-9 p-0 opacity-50 cursor-not-allowed"
                  onClick={() => navigate('/login')}
                >
                  <Heart className="h-5 w-5" />
                </Button>
              )}
              
              {isAuthenticated ? (
                <div 
                  onClick={() => {
                    if (user?.userType === 'guide' || user?.email?.endsWith('@guia.com.br')) {
                      navigate('/dashboard/guide');
                    } else if (user?.userType === 'restaurant' || user?.email?.endsWith('@comercio.com.br')) {
                      navigate('/dashboard/restaurant');
                    } else {
                      navigate('/profile');
                    }
                  }}
                  className="cursor-pointer"
                >
                  <Avatar className="w-9 h-9 cursor-pointer rounded-xl">
                    {user?.profilePicture ? (
                      <AvatarImage src={user.profilePicture} alt={user.name} className="rounded-xl" />
                    ) : null}
                    <AvatarFallback className="bg-gradient-to-br from-cerrado-400 to-pantanal-400 text-white font-medium text-sm rounded-xl">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-9 w-9 p-0"
                  onClick={() => navigate('/login')}
                >
                  <Avatar className="w-9 h-9 rounded-xl">
                    <AvatarFallback className="bg-gray-300 text-gray-600 rounded-xl">
                      👤
                    </AvatarFallback>
                  </Avatar>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
