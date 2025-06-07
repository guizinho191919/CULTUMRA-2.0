import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';

const EmptyBackpack = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6 pb-20">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">🎒</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Sua mochila está vazia
            </h3>
            <p className="text-gray-600 mb-4">
              Adicione destinos e experiências para planejar sua viagem.
            </p>
            <Link to="/explore">
              <Button>Explorar Destinos</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
      <Navigation />
    </div>
  );
};

export default EmptyBackpack;