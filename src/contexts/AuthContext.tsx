import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  userType?: 'admin' | 'guide' | 'restaurant';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateProfilePicture: (pictureUrl: string) => void;
  checkPaidReservation: (guideId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    console.log('Login called with:', userData);
    
    let userType: 'admin' | 'guide' | 'restaurant' | undefined;
    
    if (userData.email === 'admin@admin.com.br') {
      userType = 'admin';
    } else if (userData.email.endsWith('@guia.com.br')) {
      userType = 'guide';
    } else if (userData.email.endsWith('@comercio.com.br')) {
      userType = 'restaurant';
    }
    
    const updatedUserData = { ...userData, userType };
    setUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfilePicture = (pictureUrl: string) => {
    if (user) {
      const updatedUser = { ...user, profilePicture: pictureUrl };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const isAuthenticated = !!user;

  const checkPaidReservation = (guideId: string): boolean => {
    const userReservations = JSON.parse(localStorage.getItem('userReservations') || '[]');
    return userReservations.some((reservation: any) => 
      reservation.guideId === guideId && 
      reservation.paymentStatus === 'paid' &&
      reservation.userId === user?.id
    );
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateProfilePicture,
    checkPaidReservation,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
