
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { mockGuides } from '@/data/mockData';
import SupportButton from '@/components/support/SupportButton';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import GuideInfoCard from '@/components/chat/GuideInfoCard';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

const Chat = () => {
  const { id } = useParams();
  const { checkPaidReservation, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const guide = mockGuides.find(g => g.id === id);
  const { messages, messagesEndRef, addMessage, simulateGuideResponse } = useChatMessages(guide?.name);

  const handleSendMessage = (messageText: string) => {
    addMessage(messageText, 'user');
    simulateGuideResponse();
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (guide && !checkPaidReservation(guide.id)) {
      navigate(`/guide/${guide.id}`);
      return;
    }
  }, [guide, isAuthenticated, checkPaidReservation, navigate]);

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
        <SupportButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <ChatHeader guide={guide} />

      <ChatMessages messages={messages} messagesEndRef={messagesEndRef} />

      <div className="p-4">
        <GuideInfoCard guide={guide} />
        <ChatInput onSendMessage={handleSendMessage} />
      </div>

      <Navigation />
      <SupportButton />
    </div>
  );
};

export default Chat;

// ...existing code ...
