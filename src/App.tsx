
import { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BackpackProvider } from "@/hooks/useBackpack";
import { WalletProvider } from "@/hooks/useWallet";
import { AdminProvider } from "@/hooks/useAdmin";
import { FavoritesProvider } from "@/hooks/useFavorites";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
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

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();

  console.log('AppContent - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cerrado-50 to-pantanal-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-cerrado-500 to-pantanal-500 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
            <span className="text-white font-bold text-xl">MT</span>
          </div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" replace /> : <Login />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/" replace /> : <Register />
        } />
        <Route path="/provider-register" element={
          isAuthenticated ? <Navigate to="/" replace /> : <ProviderRegister />
        } />
        
        {/* Rotas liberadas para acesso público */}
        <Route path="/" element={<Index />} />
        <Route path="/guides" element={<Guides />} />
        <Route path="/itineraries" element={<Itineraries />} />
        <Route path="/spot/:id" element={<SpotDetail />} />
        <Route path="/guide/:id" element={<GuideDetail />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/itinerary/:id" element={<ItineraryDetail />} />
        <Route path="/events" element={<Events />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        
        {/* Rotas que continuam protegidas */}
        <Route path="/explore" element={
          isAuthenticated ? <Explore /> : <Navigate to="/login" replace />
        } />
        <Route path="/explore-food" element={
          isAuthenticated ? <ExploreFood /> : <Navigate to="/login" replace />
        } />
        <Route path="/search" element={
          isAuthenticated ? <Search /> : <Navigate to="/login" replace />
        } />
        <Route path="/chats" element={
          isAuthenticated ? <Chats /> : <Navigate to="/login" replace />
        } />
        <Route path="/chat/:id" element={
          isAuthenticated ? <Chat /> : <Navigate to="/login" replace />
        } />
        <Route path="/backpack" element={
          isAuthenticated ? <Backpack /> : <Navigate to="/login" replace />
        } />
        <Route path="/checkout" element={
          isAuthenticated ? <Checkout /> : <Navigate to="/login" replace />
        } />
        <Route path="/wallet" element={
          isAuthenticated ? <Wallet /> : <Navigate to="/login" replace />
        } />
        <Route path="/notifications" element={
          isAuthenticated ? <Notifications /> : <Navigate to="/login" replace />
        } />
        <Route path="/profile" element={
          isAuthenticated ? <Profile /> : <Navigate to="/login" replace />
        } />
        <Route path="/favorites" element={
          isAuthenticated ? <Favorites /> : <Navigate to="/login" replace />
        } />
        <Route path="/support" element={
          isAuthenticated ? <Support /> : <Navigate to="/login" replace />
        } />
        <Route path="/calendar" element={
          isAuthenticated ? <Calendar /> : <Navigate to="/login" replace />
        } />
        <Route path="/spot/:id" element={
          isAuthenticated ? <SpotDetail /> : <Navigate to="/login" replace />
        } />
        <Route path="/guide/:id" element={
          isAuthenticated ? <GuideDetail /> : <Navigate to="/login" replace />
        } />
        <Route path="/event/:id" element={
          isAuthenticated ? <EventDetail /> : <Navigate to="/login" replace />
        } />
        <Route path="/itinerary/:id" element={
          isAuthenticated ? <ItineraryDetail /> : <Navigate to="/login" replace />
        } />
        <Route path="/events" element={
          isAuthenticated ? <Events /> : <Navigate to="/login" replace />
        } />
        <Route path="/restaurant/:id" element={
          isAuthenticated ? <RestaurantDetail /> : <Navigate to="/login" replace />
        } />
        
        {/* Admin routes */}
        <Route path="/admin/*" element={
          isAuthenticated ? <AdminPanel /> : <Navigate to="/login" replace />
        } />
        
        {/* Dashboard routes */}
        <Route path="/dashboard/guide" element={
          isAuthenticated ? <GuideDashboard /> : <Navigate to="/login" replace />
        } />
        <Route path="/dashboard/restaurant" element={
          isAuthenticated ? <RestaurantDashboard /> : <Navigate to="/login" replace />
        } />
        
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="/voucher/:id/:type" element={<VoucherDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <BackpackProvider>
            <WalletProvider>
              <FavoritesProvider>
                <AdminProvider>
                  <Toaster />
                  <Sonner />
                  <AppContent />
                </AdminProvider>
              </FavoritesProvider>
            </WalletProvider>
          </BackpackProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
