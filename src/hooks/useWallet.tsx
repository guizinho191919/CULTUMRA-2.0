
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface SavedCard {
  id: string;
  nickname: string;
  holderName: string;
  cardNumber: string;
  lastFour: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
}

interface WalletContextType {
  balance: number;
  savedCards: SavedCard[];
  addBalance: (amount: number) => void;
  subtractBalance: (amount: number) => boolean;
  addCard: (card: Omit<SavedCard, 'id'>) => void;
  removeCard: (cardId: string) => void;
  getBalance: () => number;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState<number>(() => {
    const stored = localStorage.getItem('wallet_balance');
    return stored ? parseFloat(stored) : 0;
  });

  const [savedCards, setSavedCards] = useState<SavedCard[]>(() => {
    const stored = localStorage.getItem('saved_cards');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('wallet_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('saved_cards', JSON.stringify(savedCards));
  }, [savedCards]);

  const addBalance = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  const subtractBalance = (amount: number) => {
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      return true;
    }
    return false;
  };

  const addCard = (card: Omit<SavedCard, 'id'>) => {
    const newCard: SavedCard = {
      ...card,
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setSavedCards(prev => [...prev, newCard]);
  };

  const removeCard = (cardId: string) => {
    setSavedCards(prev => prev.filter(card => card.id !== cardId));
  };

  const getBalance = () => balance;

  return (
    <WalletContext.Provider value={{
      balance,
      savedCards,
      addBalance,
      subtractBalance,
      addCard,
      removeCard,
      getBalance
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
