
import { SupportMessage } from '@/hooks/useSupportMessages';
import { Message } from '@/hooks/useChatMessages';

interface ChatMessagesProps {
  messages: SupportMessage[] | Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatMessages = ({ messages, messagesEndRef }: ChatMessagesProps) => {
  const getSenderDisplayName = (sender: string) => {
    switch (sender) {
      case 'guide':
        return 'Guia';
      case 'support':
        return 'Suporte';
      case 'user':
        return 'Você';
      default:
        return 'Usuário';
    }
  };

  const getSenderColor = (sender: string) => {
    switch (sender) {
      case 'guide':
      case 'support':
        return 'bg-blue-500';
      case 'user':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 space-y-4 py-3 h-full">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`max-w-xs sm:max-w-sm md:max-w-md px-4 py-2 rounded-lg ${
            message.sender === 'user' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            <p className="text-sm">{message.text}</p>
            <p className="text-xs opacity-70 mt-1">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
