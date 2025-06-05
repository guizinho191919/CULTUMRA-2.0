
import { Link, useLocation } from 'react-router-dom';
import { AdminModule } from '@/types/admin';
import { useAdmin } from '@/hooks/useAdmin';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { 
  BarChart3, Users, Backpack, Map, Calendar, CreditCard, 
  ShoppingCart, Ticket, MessageSquare, Settings, FileText,
  Shield, Bell, Activity
} from 'lucide-react';

const adminModules: AdminModule[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: 'BarChart3',
    path: '/admin',
    permissions: ['admin', 'dashboard.view']
  },
  {
    id: 'users',
    name: 'Usuários & Guias',
    icon: 'Users',
    path: '/admin/users',
    permissions: ['admin', 'users.manage']
  },
  {
    id: 'backpacks',
    name: 'Gestão de Mochilas',
    icon: 'Backpack',
    path: '/admin/backpacks',
    permissions: ['admin', 'content.read']
  },
  {
    id: 'itineraries',
    name: 'Roteiros',
    icon: 'Map',
    path: '/admin/itineraries',
    permissions: ['admin', 'content.write']
  },
  {
    id: 'events',
    name: 'Eventos',
    icon: 'Calendar',
    path: '/admin/events',
    permissions: ['admin', 'content.write']
  },
  {
    id: 'financial',
    name: 'Financeiro',
    icon: 'CreditCard',
    path: '/admin/financial',
    permissions: ['admin', 'financial.read']
  },
  {
    id: 'checkout',
    name: 'Checkout',
    icon: 'ShoppingCart',
    path: '/admin/checkout',
    permissions: ['admin', 'financial.read']
  },
  {
    id: 'coupons',
    name: 'Cupons',
    icon: 'Ticket',
    path: '/admin/coupons',
    permissions: ['admin', 'content.write']
  },
  {
    id: 'reservations',
    name: 'Reservas',
    icon: 'FileText',
    path: '/admin/reservations',
    permissions: ['admin', 'content.read']
  },
  {
    id: 'communication',
    name: 'Comunicação',
    icon: 'MessageSquare',
    path: '/admin/communication',
    permissions: ['admin', 'content.read']
  },
  {
    id: 'settings',
    name: 'Configurações',
    icon: 'Settings',
    path: '/admin/settings',
    permissions: ['admin']
  }
];

const iconMap = {
  BarChart3, Users, Backpack, Map, Calendar, CreditCard,
  ShoppingCart, Ticket, MessageSquare, Settings, FileText,
  Shield, Bell, Activity
};

const AdminSidebar = () => {
  const { currentUser, canAccessModule } = useAdmin();
  const location = useLocation();

  const availableModules = adminModules.filter(module => 
    canAccessModule(module.permissions)
  );

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-cerrado-500 to-pantanal-500 rounded-lg flex items-center justify-center">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg gradient-text">Admin Panel</h2>
            <p className="text-xs text-gray-500">{currentUser?.name}</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gestão</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {availableModules.map((module) => {
                const IconComponent = iconMap[module.icon as keyof typeof iconMap];
                const isActive = location.pathname === module.path;
                
                return (
                  <SidebarMenuItem key={module.id}>
                    <SidebarMenuButton asChild className={cn(
                      'w-full justify-start',
                      isActive && 'bg-cerrado-100 text-cerrado-700'
                    )}>
                      <Link to={module.path} className="flex items-center space-x-3">
                        <IconComponent className="h-4 w-4" />
                        <span>{module.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="text-xs text-gray-500 text-center">
          <p>Mato Grosso Guide</p>
          <p>Admin v1.0</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
