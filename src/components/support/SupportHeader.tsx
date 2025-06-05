
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock } from 'lucide-react';

const SupportHeader = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur-md">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/">
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 flex items-center justify-center">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">🎧</span>
            </div>
            <div>
              <h3 className="font-semibold">Suporte Culturando</h3>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-500">Online</span>
              </div>
            </div>
          </div>
          <Badge className="bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            24/7
          </Badge>
        </div>
      </div>
    </header>
  );
};

export default SupportHeader;
