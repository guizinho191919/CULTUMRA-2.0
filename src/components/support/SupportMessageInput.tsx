
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface SupportMessageInputProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
}

const SupportMessageInput = ({ message, onMessageChange, onSendMessage }: SupportMessageInputProps) => {
  return (
    <div className="p-3 w-full">
      <form onSubmit={onSendMessage} className="flex space-x-2">
        <Input
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1"
          autoComplete="off"
        />
        <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 flex-shrink-0">
          <Send className="w-4 h-4" />
        </Button>
      </form>
      <p className="text-xs text-gray-500 mt-1.5 text-center">
        Tempo médio de resposta: 2-5 minutos
      </p>
    </div>
  );
};

export default SupportMessageInput;
