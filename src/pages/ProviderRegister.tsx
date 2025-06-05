
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import ProviderTypeSelector from '@/components/provider-register/ProviderTypeSelector';
import GuideForm from '@/components/provider-register/GuideForm';
import EstablishmentForm from '@/components/provider-register/EstablishmentForm';

const ProviderRegister = () => {
  const [providerType, setProviderType] = useState<'guide' | 'establishment' | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Guide form data
  const [guideData, setGuideData] = useState({
    fullName: '',
    cpf: '',
    birthDate: '',
    gender: '',
    email: '',
    phone: '',
    cadastur: '',
    cadasturValidity: '',
    languages: [] as string[],
    serviceArea: '',
    serviceDescription: '',
  });

  // Establishment form data
  const [establishmentData, setEstablishmentData] = useState({
    tradeName: '',
    cnpj: '',
    stateRegistration: '',
    category: '',
    description: '',
    email: '',
    phone: '',
    website: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    schedule: {
      monday: { open: '', close: '', closed: false },
      tuesday: { open: '', close: '', closed: false },
      wednesday: { open: '', close: '', closed: false },
      thursday: { open: '', close: '', closed: false },
      friday: { open: '', close: '', closed: false },
      saturday: { open: '', close: '', closed: false },
      sunday: { open: '', close: '', closed: false },
    },
    observations: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Determinar o email com base no tipo de fornecedor
    let email = '';
    if (providerType === 'guide') {
      email = guideData.email || '';
    } else if (providerType === 'establishment') {
      email = establishmentData.email || '';
    }

    // Verificar se o email segue o padrão correto
    if (providerType === 'guide' && !email.includes('@guia.com.br')) {
      toast({
        title: "Formato de email inválido",
        description: "Guias devem usar emails com o domínio @guia.com.br",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (providerType === 'establishment' && !email.includes('@comercio.com.br')) {
      toast({
        title: "Formato de email inválido",
        description: "Estabelecimentos devem usar emails com o domínio @comercio.com.br",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulate registration
    setTimeout(() => {
      toast({
        title: "Cadastro enviado com sucesso!",
        description: "Seu cadastro está sendo analisado. Você receberá um e-mail em até 48h.",
      });
      navigate('/login');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cerrado-50 to-pantanal-50 p-4">
      <div className="container mx-auto max-w-2xl lg:max-w-3xl">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-cerrado-500 to-pantanal-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-bold text-lg lg:text-xl">MT</span>
            </div>
            <CardTitle className="text-xl lg:text-2xl gradient-text">Cadastre seu perfil de fornecedor</CardTitle>
            <CardDescription className="text-sm lg:text-base">
              Torne-se parceiro do Mato Grosso Guide
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-6 lg:px-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Provider Type Selection */}
              <ProviderTypeSelector
                providerType={providerType}
                onProviderTypeChange={setProviderType}
              />

              {/* Guide Form */}
              {providerType === 'guide' && (
                <GuideForm
                  data={guideData}
                  onChange={setGuideData}
                />
              )}

              {/* Establishment Form */}
              {providerType === 'establishment' && (
                <EstablishmentForm
                  data={establishmentData}
                  onChange={setEstablishmentData}
                />
              )}

              {/* Submit Button */}
              {providerType && (
                <div className="pt-6 border-t">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Enviando cadastro...' : 'Enviar cadastro para análise'}
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Seu cadastro será analisado em até 48h. Você receberá um e-mail com o resultado.
                  </p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProviderRegister;
