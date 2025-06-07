import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useProfileValidation } from '@/hooks/useProfileValidation';
import { Guide } from '@/types';

interface ProfileCompletionWizardProps {
  guide: Partial<Guide>;
  onUpdateGuide: (guide: Partial<Guide>) => void;
  onComplete: () => void;
}

const ProfileCompletionWizard = ({ guide, onUpdateGuide, onComplete }: ProfileCompletionWizardProps) => {
  const validation = useProfileValidation(guide);
  const [currentStep, setCurrentStep] = useState(0);

  const getFieldLabel = (field: string) => {
    const labels: { [key: string]: string } = {
      'name': 'Nome completo',
      'description': 'Descrição dos serviços',
      'specialties': 'Especialidades',
      'languages': 'Idiomas',
      'pricePerHour': 'Preço por hora',
      'availability': 'Disponibilidade',
      'location': 'Localização',
      'experience': 'Anos de experiência',
      'profilePicture': 'Foto de perfil',
      'contact.phone': 'Telefone',
      'contact.email': 'E-mail'
    };
    return labels[field] || field;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Complete seu perfil</span>
          {validation.isComplete ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-orange-600" />
          )}
        </CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso do perfil</span>
            <span>{validation.completionPercentage}%</span>
          </div>
          <Progress value={validation.completionPercentage} className="w-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {validation.missingFields.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium text-red-600">Campos obrigatórios pendentes:</h3>
            <ul className="space-y-1">
              {validation.missingFields.map((field) => (
                <li key={field} className="flex items-center space-x-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span>{getFieldLabel(field)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {validation.isComplete && (
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
            <div>
              <h3 className="font-medium text-green-600">Perfil completo!</h3>
              <p className="text-sm text-gray-600">
                Seu perfil está completo e será exibido para os clientes.
              </p>
            </div>
            <Button onClick={onComplete} className="w-full">
              Finalizar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionWizard;