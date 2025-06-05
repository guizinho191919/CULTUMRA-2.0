
import { useState, useEffect } from 'react';

interface BackpackItem {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: 'active' | 'completed' | 'abandoned';
  items: {
    id: string;
    name: string;
    type: 'spot' | 'itinerary' | 'event';
    price: number;
    date?: string;
    location?: string;
  }[];
  totalValue: number;
  createdAt: string;
  lastUpdated: string;
}

export const useBackpackData = () => {
  const [backpacks, setBackpacks] = useState<BackpackItem[]>([]);
  const [filteredBackpacks, setFilteredBackpacks] = useState<BackpackItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadBackpacks();
  }, []);

  useEffect(() => {
    filterBackpacks();
  }, [backpacks, searchTerm, statusFilter]);

  const loadBackpacks = () => {
    const mockBackpacks: BackpackItem[] = [
      {
        id: '1',
        userId: '1',
        userName: 'João Silva',
        userEmail: 'joao@email.com',
        status: 'active',
        items: [
          {
            id: '1',
            name: 'Pantanal Adventure',
            type: 'itinerary',
            price: 450,
            date: '2024-06-15',
            location: 'Pantanal'
          },
          {
            id: '2',
            name: 'Chapada dos Guimarães',
            type: 'spot',
            price: 150,
            location: 'Chapada dos Guimarães'
          }
        ],
        totalValue: 600,
        createdAt: '2024-05-01',
        lastUpdated: '2024-05-28'
      },
      {
        id: '2',
        userId: '2',
        userName: 'Maria Santos',
        userEmail: 'maria@email.com',
        status: 'abandoned',
        items: [
          {
            id: '3',
            name: 'Festival de Inverno',
            type: 'event',
            price: 80,
            date: '2024-07-20'
          }
        ],
        totalValue: 80,
        createdAt: '2024-04-15',
        lastUpdated: '2024-04-20'
      }
    ];
    setBackpacks(mockBackpacks);
  };

  const filterBackpacks = () => {
    let filtered = backpacks;

    if (searchTerm) {
      filtered = filtered.filter(backpack => 
        backpack.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        backpack.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        backpack.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(backpack => backpack.status === statusFilter);
    }

    setFilteredBackpacks(filtered);
  };

  const deleteBackpack = (backpackId: string) => {
    setBackpacks(prev => prev.filter(b => b.id !== backpackId));
  };

  return {
    backpacks,
    filteredBackpacks,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    deleteBackpack
  };
};
