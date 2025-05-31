
import { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Explore from "./pages/Explore";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import SpotDetail from "./pages/SpotDetail";
import GuideDetail from "./pages/GuideDetail";
import EventDetail from "./pages/EventDetail";
import Chat from "./pages/Chat";
import ItineraryDetail from "./pages/ItineraryDetail";
import Events from "./pages/Events";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Criar um evento personalizado para autenticação
export const AUTH_EVENT = 'auth-change';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Função para verificar autenticação
    const checkAuth = () => {
      const user = localStorage.getItem('user');
      setIsAuthenticated(!!user);
    };
    
    // Verificar inicialmente
    checkAuth();
    
    // Adicionar listener para o evento de autenticação
    window.addEventListener(AUTH_EVENT, checkAuth);
    
    // Limpar listener ao desmontar
    return () => {
      window.removeEventListener(AUTH_EVENT, checkAuth);
    };
  }, []);

  // Mostrar loading enquanto verifica autenticação
  if (isAuthenticated === null) {
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
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/" replace /> : <Login />
            } />
            <Route path="/register" element={
              isAuthenticated ? <Navigate to="/" replace /> : <Register />
            } />
            
            {/* Rotas protegidas */}
            <Route path="/" element={
              isAuthenticated ? <Index /> : <Navigate to="/login" state={{ from: { pathname: "/" } }} replace />
            } />
            <Route path="/explore" element={
              isAuthenticated ? <Explore /> : <Navigate to="/login" state={{ from: { pathname: "/explore" } }} replace />
            } />
            <Route path="/search" element={
              isAuthenticated ? <Search /> : <Navigate to="/login" state={{ from: { pathname: "/search" } }} replace />
            } />
            <Route path="/notifications" element={
              isAuthenticated ? <Notifications /> : <Navigate to="/login" state={{ from: { pathname: "/notifications" } }} replace />
            } />
            <Route path="/profile" element={
              isAuthenticated ? <Profile /> : <Navigate to="/login" state={{ from: { pathname: "/profile" } }} replace />
            } />
            <Route path="/spot/:id" element={
              isAuthenticated ? <SpotDetail /> : <Navigate to="/login" state={{ from: location }} replace />
            } />
            <Route path="/guide/:id" element={
              isAuthenticated ? <GuideDetail /> : <Navigate to="/login" state={{ from: location }} replace />
            } />
            <Route path="/chat/:id" element={
              isAuthenticated ? <Chat /> : <Navigate to="/login" state={{ from: location }} replace />
            } />
            <Route path="/event/:id" element={
              isAuthenticated ? <EventDetail /> : <Navigate to="/login" state={{ from: location }} replace />
            } />
            <Route path="/itinerary/:id" element={
              isAuthenticated ? <ItineraryDetail /> : <Navigate to="/login" state={{ from: location }} replace />
            } />
            <Route path="/events" element={
              isAuthenticated ? <Events /> : <Navigate to="/login" state={{ from: { pathname: "/events" } }} replace />
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
