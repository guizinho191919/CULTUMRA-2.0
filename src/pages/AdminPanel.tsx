
import { useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminDashboard from '@/components/admin/AdminDashboard';
import UsersManagement from '@/components/admin/UsersManagement';
import BackpackManagement from '@/components/admin/BackpackManagement';
import ItinerariesManagement from '@/components/admin/ItinerariesManagement';
import EventsManagement from '@/components/admin/EventsManagement';
import FinancialManagement from '@/components/admin/FinancialManagement';
import CheckoutManagement from '@/components/admin/CheckoutManagement';
import CouponsManagement from '@/components/admin/CouponsManagement';
import ReservationsManagement from '@/components/admin/ReservationsManagement';
import CommunicationManagement from '@/components/admin/CommunicationManagement';
import SystemSettings from '@/components/admin/SystemSettings';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const AdminPanel = () => {
  const { currentUser, isLoading } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate('/', { replace: true });
    }
  }, [currentUser, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-cerrado-500 to-pantanal-500 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
            <span className="text-white font-bold text-xl">MT</span>
          </div>
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Acesso Restrito
          </h3>
          <p className="text-gray-600 mb-6">
            Você não tem permissão para acessar o painel administrativo.
          </p>
          <Button onClick={() => navigate('/')} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao Início</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UsersManagement />} />
              <Route path="backpacks" element={<BackpackManagement />} />
              <Route path="itineraries" element={<ItinerariesManagement />} />
              <Route path="events" element={<EventsManagement />} />
              <Route path="financial" element={<FinancialManagement />} />
              <Route path="checkout" element={<CheckoutManagement />} />
              <Route path="coupons" element={<CouponsManagement />} />
              <Route path="reservations" element={<ReservationsManagement />} />
              <Route path="communication" element={<CommunicationManagement />} />
              <Route path="settings" element={<SystemSettings />} />
            </Routes>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminPanel;
