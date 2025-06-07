import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { BackpackProvider } from '@/hooks/useBackpack';
import { FavoritesProvider } from '@/hooks/useFavorites';
import { WalletProvider } from '@/hooks/useWallet';
import { AdminProvider } from '@/hooks/useAdmin';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Wallet from "./pages/Wallet";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProviderRegister from "./pages/ProviderRegister";
import Explore from "./pages/Explore";
import Search from "./pages/Search";
import Chats from "./pages/Chats";
import Backpack from "./pages/Backpack";
import Checkout from "./pages/Checkout";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import SpotDetail from "./pages/SpotDetail";
import GuideDetail from "./pages/GuideDetail";
import EventDetail from "./pages/EventDetail";
import Chat from "./pages/Chat";
import ItineraryDetail from "./pages/ItineraryDetail";
import Events from "./pages/Events";
import NotFound from "./pages/NotFound";
import AdminPanel from "./pages/AdminPanel";
import ExploreFood from "./pages/ExploreFood";
import Favorites from "./pages/Favorites";
import Support from "./pages/Support";
import Calendar from "./pages/Calendar";
import RestaurantDetail from "./pages/RestaurantDetail";
import Guides from "./pages/Guides";
import Itineraries from "./pages/Itineraries";
import VoucherDetail from './pages/VoucherDetail';
import ScrollToTop from './components/ScrollToTop';
import GuideDashboard from "./pages/GuideDashboard";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import NotificationSettings from '@/pages/NotificationSettings';

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cerrado-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/provider-register" element={<ProviderRegister />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/explore-food" element={<ExploreFood />} />
        <Route path="/search" element={<Search />} />
        <Route path="/guides" element={<Guides />} />
        <Route path="/itineraries" element={<Itineraries />} />
        <Route path="/events" element={<Events />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/backpack" element={<Backpack />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/support" element={<Support />} />
        <Route path="/spot/:id" element={<SpotDetail />} />
        <Route path="/guide/:id" element={<GuideDetail />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/itinerary/:id" element={<ItineraryDetail />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        <Route path="/voucher/:type/:id" element={<VoucherDetail />} />
        <Route path="/dashboard/guide" element={<GuideDashboard />} />
        <Route path="/dashboard/restaurant" element={<RestaurantDashboard />} />
        <Route path="/admin/*" element={<AdminPanel />} />
        <Route path="/settings/notifications" element={<NotificationSettings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <NotificationProvider>
            <BackpackProvider>
              <FavoritesProvider>
                <WalletProvider>
                  <AdminProvider>
                    <div className="App">
                      <AppContent />
                      <Toaster />
                      <Sonner />
                    </div>
                  </AdminProvider>
                </WalletProvider>
              </FavoritesProvider>
            </BackpackProvider>
          </NotificationProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
