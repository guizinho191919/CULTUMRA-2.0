import { useState, useEffect } from 'react';
import { Guide } from '@/types';

interface ProfileValidation {
  isComplete: boolean;
  completionPercentage: number;
  missingFields: string[];
  requiredFields: string[];
}

// Função utilitária para validar perfil de guia
export const validateGuideProfile = (guide: Partial<Guide>): ProfileValidation => {
  const requiredFields = [
    'name',
    'description',
    'specialties',
    'languages',
    'pricePerHour',
    'availability',
    'location',
    'experience',
    'profilePicture',
    'contact.phone',
    'contact.email'
  ];

  const missingFields: string[] = [];
  
  requiredFields.forEach(field => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (!guide[parent as keyof Guide] || !(guide[parent as keyof Guide] as any)[child]) {
        missingFields.push(field);
      }
    } else {
      const value = guide[field as keyof Guide];
      if (!value || (Array.isArray(value) && value.length === 0)) {
        missingFields.push(field);
      }
    }
  });

  const completionPercentage = Math.round(
    ((requiredFields.length - missingFields.length) / requiredFields.length) * 100
  );

  return {
    isComplete: missingFields.length === 0,
    completionPercentage,
    missingFields,
    requiredFields
  };
};

export const useProfileValidation = (guide: Partial<Guide>) => {
  const [validation, setValidation] = useState<ProfileValidation>({
    isComplete: false,
    completionPercentage: 0,
    missingFields: [],
    requiredFields: []
  });

  useEffect(() => {
    const result = validateGuideProfile(guide);
    setValidation(result);
  }, [guide]);

  return validation;
};