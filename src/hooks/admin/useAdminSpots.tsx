
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Spot } from '@/types/admin';
import { saveToStorage, loadFromStorage } from './storageUtils';

export const useAdminSpots = () => {
  const [spots, setSpots] = useState<Spot[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadSpots();
  }, []);

  const loadSpots = () => {
    const savedSpots = loadFromStorage('admin_spots');
    if (savedSpots) {
      setSpots(savedSpots);
    } else {
      const mockSpots: Spot[] = [
        {
          id: '1',
          name: 'Chapada dos Guimarães',
          description: 'Parque nacional com cachoeiras e formações rochosas',
          location: 'Chapada dos Guimarães, MT',
          price: 85,
          images: ['/placeholder-image.jpg'],
          category: 'Natureza',
          status: 'active',
          featured: true,
          rating: 4.7,
          reviewsCount: 123,
          createdAt: '2024-01-01'
        }
      ];
      setSpots(mockSpots);
      saveToStorage('admin_spots', mockSpots);
    }
  };

  const createSpot = (spotData: Partial<Spot>) => {
    const newSpot: Spot = {
      id: Date.now().toString(),
      name: spotData.name || '',
      description: spotData.description || '',
      location: spotData.location || '',
      price: spotData.price || 0,
      images: spotData.images || [],
      category: spotData.category || 'Natureza',
      status: 'active',
      featured: false,
      rating: 0,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
      ...spotData
    };
    
    const updatedSpots = [...spots, newSpot];
    setSpots(updatedSpots);
    saveToStorage('admin_spots', updatedSpots);
    
    toast({
      title: "Ponto turístico criado",
      description: `${newSpot.name} foi adicionado com sucesso.`
    });
    
    return newSpot;
  };

  const updateSpot = (spotId: string, updates: Partial<Spot>) => {
    const updatedSpots = spots.map(spot => 
      spot.id === spotId ? { ...spot, ...updates } : spot
    );
    setSpots(updatedSpots);
    saveToStorage('admin_spots', updatedSpots);
    
    toast({
      title: "Ponto turístico atualizado",
      description: "As informações foram salvas com sucesso."
    });
  };

  const deleteSpot = (spotId: string) => {
    const updatedSpots = spots.filter(spot => spot.id !== spotId);
    setSpots(updatedSpots);
    saveToStorage('admin_spots', updatedSpots);
    
    toast({
      title: "Ponto turístico removido",
      description: "O item foi excluído do sistema."
    });
  };

  return {
    spots,
    createSpot,
    updateSpot,
    deleteSpot
  };
};
