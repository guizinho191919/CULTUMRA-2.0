
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Chats = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const [chats] = useState([
    {
      id: '1',
      name: 'João Silva',
      lastMessage: 'Oi! Gostaria de agendar o tour para amanhã.',
      time: '10:30',
      unread: 2,
      avatar: '/placeholder.svg',
      isOnline: true,
      type: 'guide'
    },
    {
      id: '2',
      name: 'Maria Santos',
      lastMessage: 'Obrigada pela avaliação! Espero vê-lo novamente.',
      time: 'Ontem',
      unread: 0,
      avatar: '/placeholder.svg',
      isOnline: false,
      type: 'guide'
    },
    {
      id: '3',
      name: 'Restaurante Pantanal',
      lastMessage: 'Sua reserva foi confirmada para hoje às 19h.',
      time: '14:22',
      unread: 1,
      avatar: '/placeholder.svg',
      isOnline: true,
      type: 'establishment'
    },
    {
      id: '4',
      name: 'Carlos Mendes',
      lastMessage: 'O passeio foi incrível! Muito obrigado.',
      time: '2 dias',
      unread: 0,
      avatar: '/placeholder.svg',
      isOnline: false,
      type: 'guide'
    },
    {
      id: '5',
      name: 'Hotel Cerrado',
      lastMessage: 'Check-in disponível a partir das 14h.',
      time: '3 dias',
      unread: 0,
      avatar: '/placeholder.svg',
      isOnline: true,
      type: 'establishment'
    }
  ]);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUnread = chats.reduce((sum, chat) => sum + chat.unread, 0);

  const getTypeIcon = (type: string) => {
    return type === 'guide' ? '👨‍✈️' : '🏢';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold gradient-text mb-2">Mensagens</h1>
          <p className="text-gray-600">
            {totalUnread > 0 ? `${totalUnread} mensagem${totalUnread > 1 ? 'ns' : ''} não lida${totalUnread > 1 ? 's' : ''}` : 'Todas as mensagens foram lidas'}
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Input
            placeholder="Buscar conversas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        {/* Chats List */}
        <div className="space-y-2">
          {filteredChats.map((chat) => (
            <Card 
              key={chat.id} 
              className="cursor-pointer transition-all hover:shadow-md hover:bg-gray-50"
              onClick={() => navigate(`/chat/${chat.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={chat.avatar} alt={chat.name} />
                      <AvatarFallback className="bg-gradient-to-br from-cerrado-400 to-pantanal-400 text-white font-medium">
                        {chat.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Status online */}
                    {chat.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                    
                    {/* Type indicator */}
                    <div className="absolute -top-1 -left-1 text-xs">
                      {getTypeIcon(chat.type)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {chat.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {chat.time}
                        </span>
                        {chat.unread > 0 && (
                          <Badge className="bg-cerrado-500 h-5 w-5 flex items-center justify-center text-xs">
                            {chat.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredChats.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Tente buscar por outro termo.' : 'Suas conversas com guias e estabelecimentos aparecerão aqui.'}
            </p>
            {!searchTerm && (
              <Button onClick={() => navigate('/explore')}>
                Explorar destinos
              </Button>
            )}
          </div>
        )}
      </main>

      <Navigation />
    </div>
  );
};

export default Chats;
