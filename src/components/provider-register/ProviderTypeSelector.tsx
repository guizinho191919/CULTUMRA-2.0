
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User, Building } from 'lucide-react';

interface ProviderTypeSelectorProps {
  providerType: 'guide' | 'establishment' | '';
  onProviderTypeChange: (type: 'guide' | 'establishment') => void;
}

const ProviderTypeSelector = ({ providerType, onProviderTypeChange }: ProviderTypeSelectorProps) => {
  const handleSelection = (type: 'guide' | 'establishment') => {
    onProviderTypeChange(type);
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">Você é um:</Label>
      <div className="space-y-4">
        <label 
          htmlFor="guide"
          className={`cursor-pointer transition-all border-2 rounded-lg p-4 block ${
            providerType === 'guide' 
              ? 'border-cerrado-500 bg-cerrado-50 ring-2 ring-cerrado-200' 
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
          onClick={() => handleSelection('guide')}
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input 
                type="radio" 
                id="guide" 
                name="providerType" 
                value="guide" 
                checked={providerType === 'guide'}
                onChange={() => handleSelection('guide')}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                providerType === 'guide'
                  ? 'border-cerrado-500 bg-cerrado-500'
                  : 'border-gray-300 bg-white'
              }`}>
                {providerType === 'guide' && (
                  <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-12 h-12 bg-cerrado-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-cerrado-600" />
              </div>
              <div className="text-left">
                <span className="text-base font-semibold">
                  Guia Turístico
                </span>
                <p className="text-sm text-gray-600">Prestador de Serviço</p>
              </div>
            </div>
          </div>
        </label>
        
        <label 
          htmlFor="establishment"
          className={`cursor-pointer transition-all border-2 rounded-lg p-4 block ${
            providerType === 'establishment' 
              ? 'border-cerrado-500 bg-cerrado-50 ring-2 ring-cerrado-200' 
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
          onClick={() => handleSelection('establishment')}
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input 
                type="radio" 
                id="establishment" 
                name="providerType" 
                value="establishment" 
                checked={providerType === 'establishment'}
                onChange={() => handleSelection('establishment')}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                providerType === 'establishment'
                  ? 'border-cerrado-500 bg-cerrado-500'
                  : 'border-gray-300 bg-white'
              }`}>
                {providerType === 'establishment' && (
                  <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-12 h-12 bg-cerrado-100 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-cerrado-600" />
              </div>
              <div className="text-left">
                <span className="text-base font-semibold">
                  Estabelecimento Comercial
                </span>
                <p className="text-sm text-gray-600">Restaurante, Hotel, etc.</p>
              </div>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default ProviderTypeSelector;
