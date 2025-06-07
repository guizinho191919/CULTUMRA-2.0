import { useNotifications } from '@/contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

export const useNotificationHelpers = () => {
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const notifyBookingConfirmed = (bookingDetails: { title: string; date: string; location: string }) => {
    addNotification({
      type: 'booking',
      title: 'Reserva Confirmada',
      description: `Sua reserva para ${bookingDetails.title} foi confirmada para ${bookingDetails.date}.`,
      time: 'Agora',
      priority: 'high',
      actionUrl: '/bookings'
    });
  };

  const notifyNewMessage = (senderName: string, preview: string) => {
    addNotification({
      type: 'message',
      title: `Nova mensagem de ${senderName}`,
      description: preview,
      time: 'Agora',
      priority: 'high',
      actionUrl: '/chat'
    });
  };

  const notifyEventReminder = (eventTitle: string, eventDate: string) => {
    addNotification({
      type: 'reminder',
      title: 'Lembrete de Evento',
      description: `${eventTitle} acontece em ${eventDate}. Não esqueça!`,
      time: 'Agora',
      priority: 'medium',
      actionUrl: '/events'
    });
  };

  const notifyPaymentReceived = (amount: number, description: string) => {
    addNotification({
      type: 'payment',
      title: 'Pagamento Recebido',
      description: `Você recebeu R$ ${amount.toFixed(2)} - ${description}`,
      time: 'Agora',
      priority: 'high',
      actionUrl: '/wallet'
    });
  };

  const notifyPromotion = (title: string, description: string, discount?: number) => {
    addNotification({
      type: 'promotion',
      title: title,
      description: discount ? `${description} - ${discount}% de desconto!` : description,
      time: 'Agora',
      priority: 'low',
      actionUrl: '/explore'
    });
  };

  const notifySystemUpdate = (title: string, description: string) => {
    addNotification({
      type: 'system',
      title: title,
      description: description,
      time: 'Agora',
      priority: 'medium'
    });
  };

  return {
    notifyBookingConfirmed,
    notifyNewMessage,
    notifyEventReminder,
    notifyPaymentReceived,
    notifyPromotion,
    notifySystemUpdate
  };
};