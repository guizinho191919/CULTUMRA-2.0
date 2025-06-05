
export const getCuisineIcon = (cuisine: string) => {
  const icons = {
    tradicional: '🏠',
    pantaneira: '🐟',
    churrascaria: '🥩',
    regional: '🌿',
    doceria: '🧁',
    cafe: '☕',
    lanchonete: '🍔',
    pamonharia: '🌽',
    rodizio: '🍖',
    feira: '🛒'
  };
  return icons[cuisine as keyof typeof icons] || '🍽️';
};

export const getCuisineColor = (cuisine: string) => {
  const colors = {
    tradicional: 'bg-yellow-100 text-yellow-800',
    pantaneira: 'bg-blue-100 text-blue-800',
    churrascaria: 'bg-red-100 text-red-800',
    regional: 'bg-green-100 text-green-800',
    doceria: 'bg-pink-100 text-pink-800',
    cafe: 'bg-amber-100 text-amber-800',
    lanchonete: 'bg-orange-100 text-orange-800',
    pamonharia: 'bg-yellow-100 text-yellow-800',
    rodizio: 'bg-red-100 text-red-800',
    feira: 'bg-emerald-100 text-emerald-800'
  };
  return colors[cuisine as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

export const getTodayHours = (openingHours: { [key: string]: string }) => {
  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const today = new Date().getDay();
  const todayName = days[today];
  
  // Procura por correspondências exatas ou parciais
  for (const [key, value] of Object.entries(openingHours)) {
    if (key.includes(todayName)) {
      return value;
    }
  }
  
  // Fallback para Segunda-Sexta ou similar
  if (today >= 1 && today <= 5) {
    for (const [key, value] of Object.entries(openingHours)) {
      if (key.includes('Segunda') || key.includes('Terça')) {
        return value;
      }
    }
  }
  
  // Fallback para fim de semana
  if (today === 0 || today === 6) {
    for (const [key, value] of Object.entries(openingHours)) {
      if (key.includes('Sábado') || key.includes('Domingo')) {
        return value;
      }
    }
  }
  
  return 'Consulte horários';
};
