
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cerrado-500 to-pantanal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MT</span>
              </div>
              <h1 className="text-xl font-bold gradient-text hidden sm:block">
                Mato Grosso Guide
              </h1>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                placeholder="Buscar destinos, guias, eventos..."
                className={`pl-10 transition-all duration-200 ${
                  isSearchFocused ? 'ring-2 ring-cerrado-500' : ''
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            <Link to="/notifications">
              <Button variant="ghost" size="sm" className="relative">
                <span className="text-lg">🔔</span>
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-red-500">
                  2
                </Badge>
              </Button>
            </Link>
            <Button variant="ghost" size="sm">
              <span className="text-lg">❤️</span>
            </Button>
            <Link to="/profile">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cerrado-400 to-pantanal-400 flex items-center justify-center cursor-pointer">
                <span className="text-white text-sm font-medium">U</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
