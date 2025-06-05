
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageSquare, Search, Filter, Eye, Trash2, AlertTriangle,
  Star, Flag, Send, Users, TrendingUp, MessageCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderType: 'guide' | 'tourist';
  message: string;
  timestamp: string;
  isModerated?: boolean;
  moderationReason?: string;
}

interface Chat {
  id: string;
  reservationId: string;
  guideId: string;
  guideName: string;
  touristId: string;
  touristName: string;
  itemName: string;
  status: 'active' | 'archived' | 'flagged';
  lastMessage: string;
  lastMessageTime: string;
  messageCount: number;
  hasUnread: boolean;
  flaggedReason?: string;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  targetId: string;
  targetName: string;
  targetType: 'guide' | 'spot' | 'itinerary' | 'event';
  rating: number;
  comment: string;
  status: 'published' | 'pending' | 'hidden';
  createdAt: string;
  moderatedAt?: string;
  moderationReason?: string;
}

const CommunicationManagement = () => {
  const [activeTab, setActiveTab] = useState<'chats' | 'reviews'>('chats');
  const [chats, setChats] = useState<Chat[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    loadChats();
    loadReviews();
  }, []);

  useEffect(() => {
    if (activeTab === 'chats') {
      filterChats();
    } else {
      filterReviews();
    }
  }, [chats, reviews, searchTerm, statusFilter, activeTab]);

  const loadChats = () => {
    const mockChats: Chat[] = [
      {
        id: '1',
        reservationId: '1',
        guideId: '1',
        guideName: 'Carlos Pantanal',
        touristId: '1',
        touristName: 'João Silva',
        itemName: 'Pantanal Adventure',
        status: 'active',
        lastMessage: 'Combinado então! Nos encontramos às 7h.',
        lastMessageTime: '2024-05-29T16:30:00',
        messageCount: 15,
        hasUnread: false
      },
      {
        id: '2',
        reservationId: '2',
        guideId: '2',
        guideName: 'Ana Chapada',
        touristId: '2',
        touristName: 'Maria Santos',
        itemName: 'Chapada dos Guimarães',
        status: 'flagged',
        lastMessage: 'Isso não é aceitável!',
        lastMessageTime: '2024-05-29T14:45:00',
        messageCount: 8,
        hasUnread: true,
        flaggedReason: 'Linguagem inapropriada'
      }
    ];
    setChats(mockChats);
  };

  const loadReviews = () => {
    const mockReviews: Review[] = [
      {
        id: '1',
        userId: '1',
        userName: 'João Silva',
        targetId: '1',
        targetName: 'Carlos Pantanal',
        targetType: 'guide',
        rating: 5,
        comment: 'Excelente guia! Muito conhecedor da região e atencioso.',
        status: 'published',
        createdAt: '2024-05-28T18:00:00'
      },
      {
        id: '2',
        userId: '2',
        userName: 'Maria Santos',
        targetId: '1',
        targetName: 'Pantanal Adventure',
        targetType: 'itinerary',
        rating: 2,
        comment: 'Roteiro muito cansativo e sem estrutura adequada. Não recomendo.',
        status: 'pending',
        createdAt: '2024-05-29T20:15:00'
      }
    ];
    setReviews(mockReviews);
  };

  const filterChats = () => {
    let filtered = chats;

    if (searchTerm) {
      filtered = filtered.filter(chat => 
        chat.guideName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.touristName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.itemName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(chat => chat.status === statusFilter);
    }

    setFilteredChats(filtered);
  };

  const filterReviews = () => {
    let filtered = reviews;

    if (searchTerm) {
      filtered = filtered.filter(review => 
        review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(review => review.status === statusFilter);
    }

    setFilteredReviews(filtered);
  };

  const handleModerateReview = (reviewId: string, action: 'approve' | 'hide', reason?: string) => {
    setReviews(prev => prev.map(r => 
      r.id === reviewId 
        ? { 
            ...r, 
            status: action === 'approve' ? 'published' : 'hidden',
            moderatedAt: new Date().toISOString(),
            moderationReason: reason
          }
        : r
    ));
    
    toast({
      title: "Avaliação moderada",
      description: `A avaliação foi ${action === 'approve' ? 'aprovada' : 'ocultada'} com sucesso.`
    });
  };

  const handleFlagChat = (chatId: string, reason: string) => {
    setChats(prev => prev.map(c => 
      c.id === chatId 
        ? { ...c, status: 'flagged', flaggedReason: reason }
        : c
    ));
    
    toast({
      title: "Chat sinalizado",
      description: "O chat foi sinalizado para revisão."
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'published': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'flagged': return 'bg-red-100 text-red-700';
      case 'hidden': return 'bg-gray-100 text-gray-700';
      case 'archived': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string, type: 'chat' | 'review') => {
    if (type === 'chat') {
      switch (status) {
        case 'active': return 'Ativo';
        case 'flagged': return 'Sinalizado';
        case 'archived': return 'Arquivado';
        default: return status;
      }
    } else {
      switch (status) {
        case 'published': return 'Publicada';
        case 'pending': return 'Pendente';
        case 'hidden': return 'Oculta';
        default: return status;
      }
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Gestão de Comunicação</h1>
          <p className="text-gray-600">Monitore chats e modere avaliações</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <Button
          variant={activeTab === 'chats' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('chats')}
          className="flex-1"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Chats
        </Button>
        <Button
          variant={activeTab === 'reviews' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('reviews')}
          className="flex-1"
        >
          <Star className="h-4 w-4 mr-2" />
          Avaliações
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {activeTab === 'chats' ? (
          <>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Chats Ativos</p>
                    <p className="text-2xl font-bold">{chats.filter(c => c.status === 'active').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Flag className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Sinalizados</p>
                    <p className="text-2xl font-bold">{chats.filter(c => c.status === 'flagged').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total de Mensagens</p>
                    <p className="text-2xl font-bold">{chats.reduce((sum, c) => sum + c.messageCount, 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Não Lidas</p>
                    <p className="text-2xl font-bold">{chats.filter(c => c.hasUnread).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Star className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Publicadas</p>
                    <p className="text-2xl font-bold">{reviews.filter(r => r.status === 'published').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600">Pendentes</p>
                    <p className="text-2xl font-bold">{reviews.filter(r => r.status === 'pending').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Eye className="h-8 w-8 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Ocultas</p>
                    <p className="text-2xl font-bold">{reviews.filter(r => r.status === 'hidden').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Nota Média</p>
                    <p className="text-2xl font-bold">{(reviews.filter(r => r.status === 'published').reduce((sum, r) => sum + r.rating, 0) / reviews.filter(r => r.status === 'published').length || 0).toFixed(1)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={`Buscar ${activeTab === 'chats' ? 'chats' : 'avaliações'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                {activeTab === 'chats' ? (
                  <>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="flagged">Sinalizados</SelectItem>
                    <SelectItem value="archived">Arquivados</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="published">Publicadas</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="hidden">Ocultas</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filtros Avançados</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Chats ou Avaliações */}
      <div className="grid grid-cols-1 gap-4">
        {activeTab === 'chats' ? (
          filteredChats.map((chat) => (
            <Card key={chat.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {chat.touristName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg">{chat.itemName}</h3>
                        <Badge className={getStatusColor(chat.status)}>
                          {getStatusLabel(chat.status, 'chat')}
                        </Badge>
                        {chat.hasUnread && (
                          <Badge variant="destructive">Nova mensagem</Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <p>Turista: {chat.touristName}</p>
                          <p>Guia: {chat.guideName}</p>
                        </div>
                        <div>
                          <p>Mensagens: {chat.messageCount}</p>
                          <p>Última: {new Date(chat.lastMessageTime).toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg mb-3">
                        <p className="text-sm font-medium">Última mensagem:</p>
                        <p className="text-sm">{chat.lastMessage}</p>
                      </div>

                      {chat.flaggedReason && (
                        <div className="p-3 bg-red-50 rounded-lg">
                          <p className="text-sm text-red-700">
                            <span className="font-medium">Motivo da sinalização:</span> {chat.flaggedReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>Ver Chat</span>
                    </Button>
                    {chat.status !== 'flagged' && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleFlagChat(chat.id, 'Conteúdo inapropriado')}
                        className="flex items-center space-x-2"
                      >
                        <Flag className="h-4 w-4" />
                        <span>Sinalizar</span>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          filteredReviews.map((review) => (
            <Card key={review.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {review.userName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg">{review.targetName}</h3>
                        <Badge className={getStatusColor(review.status)}>
                          {getStatusLabel(review.status, 'review')}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-3">
                        <p>Por: {review.userName} • {new Date(review.createdAt).toLocaleString()}</p>
                        <p>Tipo: {review.targetType === 'guide' ? 'Guia' : review.targetType === 'spot' ? 'Ponto Turístico' : review.targetType === 'itinerary' ? 'Roteiro' : 'Evento'}</p>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg mb-3">
                        <p className="text-sm">{review.comment}</p>
                      </div>

                      {review.moderationReason && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-700">
                            <span className="font-medium">Moderação:</span> {review.moderationReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    {review.status === 'pending' && (
                      <>
                        <Button 
                          size="sm"
                          onClick={() => handleModerateReview(review.id, 'approve')}
                          className="flex items-center space-x-2"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Aprovar</span>
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleModerateReview(review.id, 'hide', 'Conteúdo inapropriado')}
                          className="flex items-center space-x-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Ocultar</span>
                        </Button>
                      </>
                    )}
                    {review.status === 'published' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleModerateReview(review.id, 'hide', 'Revisão administrativa')}
                        className="flex items-center space-x-2"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Ocultar</span>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CommunicationManagement;
