
import { useState } from 'react';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import SupportHeader from '@/components/support/SupportHeader';
import SupportInfoCard from '@/components/support/SupportInfoCard';
import QuickQuestions from '@/components/support/QuickQuestions';
import SupportMessageInput from '@/components/support/SupportMessageInput';
import ChatMessages from '@/components/chat/ChatMessages';
import { useSupportMessages } from '@/hooks/useSupportMessages';

const Support = () => {
  const [message, setMessage] = useState('');
  const { 
    messages, 
    chatStarted, 
    messagesEndRef, 
    addMessage, 
    simulateSupportResponse 
  } = useSupportMessages();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    addMessage(message, 'user');
    setMessage('');
    simulateSupportResponse();
  };

  const handleSelectQuestion = (question: string) => {
    addMessage(question, 'user');
    simulateSupportResponse();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <SupportHeader />

      {/* Layout principal com largura máxima para desktop */}
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-3xl px-4 pt-3 pb-2">
          <SupportInfoCard />
          
          <QuickQuestions 
            onSelectQuestion={handleSelectQuestion}
            visible={!chatStarted}
          />
          
          {/* Área de chat com altura fixa para desktop */}
          {chatStarted && (
            <div className="w-full mt-4 bg-white rounded-lg shadow-sm border overflow-hidden" 
                 style={{ height: 'calc(100vh - 350px)', minHeight: '300px' }}>
              <ChatMessages messages={messages} messagesEndRef={messagesEndRef} />
            </div>
          )}
          
          {/* Espaço vazio menor quando não há chat */}
          {!chatStarted && <div className="h-8" />}
          
          {/* Input de mensagem fixo na parte inferior do container, não da tela */}
          <div className="mt-4 bg-white rounded-lg shadow-sm border">
            <SupportMessageInput 
              message={message}
              onMessageChange={setMessage}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Support;
