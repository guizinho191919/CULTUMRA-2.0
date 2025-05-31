
import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockGuides } from '@/data/mockData';
import { ArrowLeft, Send, Phone, Video } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'guide';
  timestamp: Date;
}

const Chat = () => {
  const { id } = useParams();
  const guide = mockGuides.find(g => g.id === id);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Olá! Sou ${guide?.name}. Como posso te ajudar a planejar sua aventura em Mato Grosso?`,
      sender: 'guide',
      timestamp: new Date(Date.now() - 300000)
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Simular resposta do guia
    setTimeout(() => {
      const responses = [
        "Ótima escolha! Posso te sugerir alguns locais incríveis para visitar.",
        "Que tipo de aventura você está procurando? Ecoturismo, cultura ou aventura?",
        "Tenho várias opções de pacotes que podem te interessar. Vamos conversar sobre suas preferências?",
        "Posso criar um roteiro personalizado para você. Quantos dias você tem disponível?"
      ];
      
      const guideResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'guide',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, guideResponse]);
    }, 1000);
  };

  if (!guide) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6 pb-20">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😞</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Guia não encontrado
            </h3>
            <Link to="/search">
              <Button>Buscar guias</Button>
            </Link>
          </div>
        </main>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <img
              src={guide.photo}
              alt={guide.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold">{guide.name}</h3>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-500">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-cerrado-600 text-white'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p className={`text-xs mt-1 ${
                msg.sender === 'user' ? 'text-white/70' : 'text-gray-500'
              }`}>
                {msg.timestamp.toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Guide Info Card */}
      <div className="p-4">
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Informações do Guia</h4>
              <Badge className="bg-cerrado-100 text-cerrado-800">
                R$ {guide.pricePerHour}/hora
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="font-semibold text-cerrado-600">{guide.rating}</div>
                <div className="text-gray-500">Avaliação</div>
              </div>
              <div>
                <div className="font-semibold text-cerrado-600">{guide.experience}</div>
                <div className="text-gray-500">Anos exp.</div>
              </div>
              <div>
                <div className="font-semibold text-cerrado-600">{guide.reviews}</div>
                <div className="text-gray-500">Avaliações</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1"
          />
          <Button type="submit" size="sm">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>

      <Navigation />
    </div>
  );
};

export default Chat;
