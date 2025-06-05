
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/admin';
import { saveToStorage, loadFromStorage } from './storageUtils';

export const useAdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const savedUsers = loadFromStorage('admin_users');
    if (savedUsers) {
      setUsers(savedUsers);
    } else {
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'João Silva',
          email: 'joao@email.com',
          type: 'tourist',
          status: 'active',
          balance: 150.50,
          createdAt: '2024-01-15',
          phone: '(65) 99999-1234',
          location: 'Cuiabá, MT'
        },
        {
          id: '2',
          name: 'Carlos Pantanal',
          email: 'carlos@guide.com',
          type: 'guide',
          status: 'active',
          balance: 2350.75,
          createdAt: '2024-01-10',
          phone: '(65) 98888-5678',
          location: 'Pantanal, MT',
          specialties: ['Pantanal', 'Pesca', 'Observação de aves'],
          cadastur: '12.345.678.90-1',
          rating: 4.9,
          reviewsCount: 45
        }
      ];
      setUsers(mockUsers);
      saveToStorage('admin_users', mockUsers);
    }
  };

  const createUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || '',
      email: userData.email || '',
      type: userData.type || 'tourist',
      status: 'active',
      balance: 0,
      createdAt: new Date().toISOString(),
      ...userData
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveToStorage('admin_users', updatedUsers);
    
    toast({
      title: "Usuário criado",
      description: `${newUser.name} foi adicionado com sucesso.`
    });
    
    return newUser;
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    );
    setUsers(updatedUsers);
    saveToStorage('admin_users', updatedUsers);
    
    toast({
      title: "Usuário atualizado",
      description: "As informações foram salvas com sucesso."
    });
  };

  const deleteUser = (userId: string) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    saveToStorage('admin_users', updatedUsers);
    
    toast({
      title: "Usuário removido",
      description: "O usuário foi excluído do sistema."
    });
  };

  const updateUserBalance = (userId: string, amount: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      const newBalance = user.balance + amount;
      updateUser(userId, { balance: newBalance });
      
      toast({
        title: amount > 0 ? "Saldo adicionado" : "Saldo debitado",
        description: `Novo saldo: R$ ${newBalance.toFixed(2)}`
      });
    }
  };

  return {
    users,
    createUser,
    updateUser,
    deleteUser,
    updateUserBalance
  };
};
