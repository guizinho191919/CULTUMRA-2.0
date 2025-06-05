
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="text-center py-16">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold mb-4">Planeje sua próxima aventura</h3>
          <p className="text-gray-600 mb-6">
            Conecte-se com guias locais, descubra roteiros únicos e viva experiências inesquecíveis em Mato Grosso
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-cerrado-600 hover:bg-cerrado-700" onClick={() => navigate('/register')}>
              🎯 Criar Conta
            </Button>
            <Button size="lg" variant="outline">
              📱 Baixar App
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default CTASection;
