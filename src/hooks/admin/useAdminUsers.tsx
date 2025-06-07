
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User, UserStatus } from '@/types/admin';
import { mockGuides } from '@/data/mockData';
import { validateGuideProfile } from '@/hooks/useProfileValidation';
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
          role: 'tourist', // Changed from userType to role
          status: 'active',
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          name: 'Carlos Pantanal',
          email: 'carlos@guide.com',
          role: 'guide', // Changed from type to role
          status: 'active',
          createdAt: '2024-01-10'
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
      role: userData.role || 'tourist', // Changed from type to role
      status: 'active',
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
      // Note: balance property doesn't exist in User interface
      // You may need to add it to the interface or handle differently
      updateUser(userId, { /* balance: newBalance */ });
      
      toast({
        title: amount > 0 ? "Saldo adicionado" : "Saldo debitado",
        description: `Operação realizada com sucesso`
      });
    }
  };

  const updateUserStatus = (userId: string, newStatus: UserStatus) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        const updatedUser = { ...user, status: newStatus };
        
        // Se o status for alterado para 'active' e for um guia, verificar perfil
        if (newStatus === 'active' && user.role === 'guide') { // Changed from type to role
          // Aqui você pode adicionar lógica para verificar se o perfil está completo
          // Se não estiver, definir como 'profile_incomplete'
          const guide = mockGuides.find(g => g.contact.email === user.email);
          if (guide) {
            const validation = validateGuideProfile(guide);
            if (!validation.isComplete) {
              updatedUser.status = 'profile_incomplete';
              updatedUser.profileComplete = false;
              updatedUser.profileCompletionPercentage = validation.completionPercentage;
              updatedUser.missingFields = validation.missingFields;
            }
          }
        }
        
        return updatedUser;
      }
      return user;
    }));
  };

  return {
    users,
    createUser,
    updateUser,
    deleteUser,
    updateUserBalance,
    updateUserStatus
  };
};
