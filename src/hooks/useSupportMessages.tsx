
import { useState, useRef, useEffect } from 'react';

export interface SupportMessage {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
}

export const useSupportMessages = () => {
  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: '1',
      text: 'Olá! Bem-vindo ao suporte da MT Turismo. Como posso te ajudar hoje?',
      sender: 'support',
      timestamp: new Date(Date.now() - 60000)
    }
  ]);
  const [chatStarted, setChatStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, sender: 'user' | 'support') => {
    const newMessage: SupportMessage = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    
    if (sender === 'user') {
      setChatStarted(true);
    }
  };

  const simulateSupportResponse = () => {
    setTimeout(() => {
      const responses = [
        "Obrigado pela sua mensagem! Vou analisar sua solicitação e te responder em breve.",
        "Entendi sua dúvida. Deixe-me verificar isso para você.",
        "Ótima pergunta! Vou consultar nossa equipe especializada.",
        "Recebido! Estou trabalhando na sua solicitação.",
        "Posso te ajudar com isso. Deixe-me buscar as informações mais atualizadas.",
        "Compreendo sua situação. Vou resolver isso para você o mais rápido possível."
      ];
      
      const supportResponse: SupportMessage = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'support',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, supportResponse]);
    }, 1500);
  };

  return {
    messages,
    chatStarted,
    messagesEndRef,
    addMessage,
    simulateSupportResponse
  };
};
