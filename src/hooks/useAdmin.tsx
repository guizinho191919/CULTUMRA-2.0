
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AdminUser, AdminStats, AdminAlert, UserRole } from '@/types/admin';

interface AdminContextType {
  currentUser: AdminUser | null;
  stats: AdminStats;
  alerts: AdminAlert[];
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  canAccessModule: (modulePermissions: string[]) => boolean;
  markAlertAsRead: (alertId: string) => void;
  refreshStats: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['*'], // Full access
  content_manager: ['content.read', 'content.write', 'spots.manage', 'itineraries.manage', 'events.manage'],
  financial: ['financial.read', 'financial.write', 'wallet.manage', 'transactions.view'],
  guide: ['guide.profile', 'guide.reservations', 'guide.messages'],
  tourist: ['tourist.profile', 'tourist.reservations']
};

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalReservations: 0,
    pendingReservations: 0,
    confirmedReservations: 0,
    totalRevenue: 0,
    newUsers: 0,
    newGuides: 0,
    activeCoupons: 0,
    totalBackpacks: 0
  });
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);

  useEffect(() => {
    // Check if user is admin
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      // Para fins de demonstração, se o email contém 'admin', concede acesso de admin
      if (userData.email?.includes('admin')) {
        const adminUser: AdminUser = {
          id: userData.id || '1',
          name: userData.name,
          email: userData.email,
          role: 'admin',
          permissions: ROLE_PERMISSIONS.admin,
          isActive: true,
          lastLogin: new Date()
        };
        setCurrentUser(adminUser);
      }
    }
    
    // Load mock stats
    loadMockStats();
    loadMockAlerts();
    setIsLoading(false);
  }, []);

  const loadMockStats = () => {
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const backpacks = JSON.parse(localStorage.getItem('backpack_items') || '[]');
    
    setStats({
      totalReservations: reservations.length,
      pendingReservations: reservations.filter((r: any) => r.status === 'pending').length,
      confirmedReservations: reservations.filter((r: any) => r.status === 'confirmed').length,
      totalRevenue: reservations.reduce((sum: number, r: any) => sum + (r.totalPaid || 0), 0),
      newUsers: users.length,
      newGuides: Math.floor(users.length * 0.2),
      activeCoupons: 5,
      totalBackpacks: backpacks.length
    });
  };

  const loadMockAlerts = () => {
    const mockAlerts: AdminAlert[] = [
      {
        id: '1',
        type: 'warning',
        title: 'Reservas Pendentes',
        message: '5 reservas aguardando confirmação há mais de 24h',
        timestamp: new Date(),
        isRead: false
      },
      {
        id: '2',
        type: 'info',
        title: 'Novos Cadastros',
        message: '12 novos usuários cadastrados hoje',
        timestamp: new Date(),
        isRead: false
      }
    ];
    setAlerts(mockAlerts);
  };

  const hasPermission = (permission: string) => {
    if (!currentUser) return false;
    if (currentUser.permissions.includes('*')) return true;
    return currentUser.permissions.includes(permission);
  };

  const canAccessModule = (modulePermissions: string[]) => {
    if (!currentUser) return false;
    if (currentUser.permissions.includes('*')) return true;
    return modulePermissions.some(permission => currentUser.permissions.includes(permission));
  };

  const markAlertAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const refreshStats = () => {
    loadMockStats();
  };

  return (
    <AdminContext.Provider value={{
      currentUser,
      stats,
      alerts,
      isLoading,
      hasPermission,
      canAccessModule,
      markAlertAsRead,
      refreshStats
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
