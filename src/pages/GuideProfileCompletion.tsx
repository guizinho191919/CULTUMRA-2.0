import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import ProfileCompletionWizard from '@/components/guides/ProfileCompletionWizard';
import { useAuth } from '@/hooks/useAuth';
import { Guide } from '@/types';

const GuideProfileCompletion = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [guide, setGuide] = useState<Partial<Guide>>({});

  const handleUpdateGuide = (updatedGuide: Partial<Guide>) => {
    setGuide(updatedGuide);
    // Aqui você salvaria os dados do guia
  };

  const handleComplete = () => {
    // Atualizar status do usuário para 'active'
    // Redirecionar para dashboard do guia
    navigate('/guide-dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold gradient-text mb-2">
            Complete seu perfil
          </h1>
          <p className="text-gray-600">
            Para aparecer para os clientes, você precisa completar todas as informações do seu perfil.
          </p>
        </div>

        <ProfileCompletionWizard
          guide={guide}
          onUpdateGuide={handleUpdateGuide}
          onComplete={handleComplete}
        />
      </main>

      <Navigation />
    </div>
  );
};

export default GuideProfileCompletion;