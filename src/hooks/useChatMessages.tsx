
import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'guide';
  timestamp: Date;
}

export const useChatMessages = (guideName?: string) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Olá! Sou ${guideName}. Como posso te ajudar a planejar sua aventura em Mato Grosso?`,
      sender: 'guide',
      timestamp: new Date(Date.now() - 300000)
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    // Apenas fazer scroll se estivermos em uma página de chat
    if (window.location.pathname.includes('/chat')) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, sender: 'user' | 'guide') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const simulateGuideResponse = () => {
    setTimeout(() => {
      const responses = [
        "Ótima escolha! Posso te sugerir alguns locais incríveis para visitar.",
        "Que tipo de aventura você está procurando? Ecoturismo, cultura ou aventura?",
        "Tenho várias opções de pacotes que podem te interessar. Vamos conversar sobre suas preferências?",
        "Posso criar um roteiro personalizado para você. Quantos dias você tem disponível?"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addMessage(randomResponse, 'guide');
    }, 1000);
  };

  return {
    messages,
    messagesEndRef,
    addMessage,
    simulateGuideResponse
  };
};

export type { Message };
