import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRealtimeSync } from './useRealtimeSync';

interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export const useRealtimeChat = (chatId: string) => {
  const { user } = useAuth();
  const { syncData, syncEvents } = useRealtimeSync();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Carrega mensagens do localStorage
  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem(`chat_${chatId}`) || '[]');
    setMessages(savedMessages);
    
    const unread = savedMessages.filter((msg: ChatMessage) => 
      !msg.read && msg.receiverId === user?.id
    ).length;
    setUnreadCount(unread);
  }, [chatId, user?.id]);

  // Escuta eventos de sincronização
  useEffect(() => {
    const messageEvents = syncEvents.filter(event => 
      event.type === 'message' && 
      (event.data.chatId === chatId || event.data.receiverId === user?.id)
    );

    if (messageEvents.length > 0) {
      const latestEvent = messageEvents[messageEvents.length - 1];
      const newMessage = latestEvent.data;
      
      setMessages(prev => {
        const exists = prev.find(msg => msg.id === newMessage.id);
        if (!exists) {
          const updated = [...prev, newMessage];
          localStorage.setItem(`chat_${chatId}`, JSON.stringify(updated));
          return updated;
        }
        return prev;
      });

      if (newMessage.receiverId === user?.id && !newMessage.read) {
        setUnreadCount(prev => prev + 1);
      }
    }
  }, [syncEvents, chatId, user?.id]);

  const sendMessage = useCallback((message: string, receiverId: string) => {
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random()}`,
      senderId: user?.id || '',
      receiverId,
      message,
      timestamp: Date.now(),
      read: false
    };

    setMessages(prev => {
      const updated = [...prev, newMessage];
      localStorage.setItem(`chat_${chatId}`, JSON.stringify(updated));
      return updated;
    });

    // Sincroniza com outros painéis
    syncData('message', { ...newMessage, chatId }, receiverId);
  }, [user?.id, chatId, syncData]);

  const markAsRead = useCallback((messageId: string) => {
    setMessages(prev => {
      const updated = prev.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      );
      localStorage.setItem(`chat_${chatId}`, JSON.stringify(updated));
      return updated;
    });
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, [chatId]);

  return {
    messages,
    unreadCount,
    sendMessage,
    markAsRead
  };
};