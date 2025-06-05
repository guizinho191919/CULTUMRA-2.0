
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Itinerary } from '@/types/admin';
import { saveToStorage, loadFromStorage } from './storageUtils';

export const useAdminItineraries = () => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadItineraries();
  }, []);

  const loadItineraries = () => {
    const savedItineraries = loadFromStorage('admin_itineraries');
    if (savedItineraries) {
      setItineraries(savedItineraries);
    } else {
      const mockItineraries: Itinerary[] = [
        {
          id: '1',
          name: 'Pantanal Adventure',
          description: 'Aventura completa no Pantanal com guia especializado',
          duration: '3 dias',
          price: 450,
          guideId: '2',
          guideName: 'Carlos Pantanal',
          maxParticipants: 8,
          currentParticipants: 5,
          status: 'active',
          featured: true,
          images: ['/placeholder-image.jpg'],
          createdAt: '2024-01-05'
        }
      ];
      setItineraries(mockItineraries);
      saveToStorage('admin_itineraries', mockItineraries);
    }
  };

  const createItinerary = (itineraryData: Partial<Itinerary>) => {
    const newItinerary: Itinerary = {
      id: Date.now().toString(),
      name: itineraryData.name || '',
      description: itineraryData.description || '',
      duration: itineraryData.duration || '1 dia',
      price: itineraryData.price || 0,
      guideId: itineraryData.guideId || '',
      guideName: itineraryData.guideName || '',
      maxParticipants: itineraryData.maxParticipants || 10,
      currentParticipants: 0,
      status: 'active',
      featured: false,
      images: itineraryData.images || [],
      createdAt: new Date().toISOString(),
      ...itineraryData
    };
    
    const updatedItineraries = [...itineraries, newItinerary];
    setItineraries(updatedItineraries);
    saveToStorage('admin_itineraries', updatedItineraries);
    
    toast({
      title: "Roteiro criado",
      description: `${newItinerary.name} foi adicionado com sucesso.`
    });
    
    return newItinerary;
  };

  const updateItinerary = (itineraryId: string, updates: Partial<Itinerary>) => {
    const updatedItineraries = itineraries.map(itinerary => 
      itinerary.id === itineraryId ? { ...itinerary, ...updates } : itinerary
    );
    setItineraries(updatedItineraries);
    saveToStorage('admin_itineraries', updatedItineraries);
    
    toast({
      title: "Roteiro atualizado",
      description: "As informações foram salvas com sucesso."
    });
  };

  const deleteItinerary = (itineraryId: string) => {
    const updatedItineraries = itineraries.filter(itinerary => itinerary.id !== itineraryId);
    setItineraries(updatedItineraries);
    saveToStorage('admin_itineraries', updatedItineraries);
    
    toast({
      title: "Roteiro removido",
      description: "O item foi excluído do sistema."
    });
  };

  return {
    itineraries,
    createItinerary,
    updateItinerary,
    deleteItinerary
  };
};
