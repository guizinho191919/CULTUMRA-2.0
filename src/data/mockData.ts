
import { TouristSpot, Guide, Itinerary, Event } from '@/types';

export const categories = [
  { id: 'todos', name: 'Todos', icon: '🗺️', count: 0 },
  { id: 'natureza', name: 'Natureza', icon: '🌿', count: 0 },
  { id: 'aventura', name: 'Aventura', icon: '🏔️', count: 0 },
  { id: 'cultura', name: 'Cultura', icon: '🎭', count: 0 },
  { id: 'historia', name: 'História', icon: '🏛️', count: 0 },
];

export const mockTouristSpots: TouristSpot[] = [
  {
    id: '1',
    name: 'Pantanal Norte',
    description: 'Maior planície alagável do mundo, lar de uma biodiversidade única com jacarés, onças-pintadas, capivaras e centenas de espécies de aves.',
    images: [
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop'
    ],
    location: {
      address: 'Transpantaneira, Km 0',
      city: 'Poconé',
      state: 'Mato Grosso',
      coordinates: { lat: -16.2587, lng: -56.6228 }
    },
    categories: ['natureza', 'aventura'],
    rating: 4.8,
    reviews: 1247,
    priceRange: '$$',
    features: ['Safari', 'Pesca', 'Observação de Aves', '+1'],
    activities: ['Safari fotográfico', 'Pesca esportiva', 'Observação de aves', 'Caminhadas ecológicas'],
    bestSeason: 'Maio a setembro (estação seca)',
    difficulty: 'Moderado',
    openingHours: {
      'Segunda-feira': '06:00 - 18:00',
      'Terça-feira': '06:00 - 18:00',
      'Quarta-feira': '06:00 - 18:00',
      'Quinta-feira': '06:00 - 18:00',
      'Sexta-feira': '06:00 - 18:00',
      'Sábado': '06:00 - 18:00',
      'Domingo': '06:00 - 18:00'
    }
  },
  {
    id: '2',
    name: 'Chapada dos Guimarães',
    description: 'Impressionante formação rochosa com cachoeiras cristalinas, mirantes espetaculares e rica fauna do cerrado.',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
    ],
    location: {
      address: 'Centro Geodésico da América do Sul',
      city: 'Chapada dos Guimarães',
      state: 'Mato Grosso',
      coordinates: { lat: -15.4608, lng: -55.7496 }
    },
    categories: ['natureza', 'aventura'],
    rating: 4.7,
    reviews: 892,
    priceRange: '$',
    features: ['Rapel', 'Trekking', 'Banho de Cachoeira', '+1'],
    activities: ['Trilhas', 'Rappel', 'Banho de cachoeira', 'Contemplação'],
    bestSeason: 'Abril a setembro',
    difficulty: 'Difícil'
  },
  {
    id: '3',
    name: 'Casa do Artesão',
    description: 'Centro cultural que preserva e promove o artesanato tradicional de Mato Grosso, com peças únicas da cultura regional.',
    images: [
      'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&h=600&fit=crop'
    ],
    location: {
      address: 'Rua 13 de Junho, 315',
      city: 'Cuiabá',
      state: 'Mato Grosso',
      coordinates: { lat: -15.6014, lng: -56.0979 }
    },
    categories: ['cultura', 'historia'],
    rating: 4.3,
    reviews: 324,
    priceRange: '$',
    features: ['Exposições', 'Oficinas', 'Loja de Souvenirs', '+1'],
    activities: ['Visitação guiada', 'Oficinas de artesanato', 'Compras'],
    bestSeason: 'O ano todo',
    difficulty: 'Fácil'
  },
  {
    id: '4',
    name: 'Arsenal de Guerra',
    description: 'Museu histórico que conta a história militar de Mato Grosso e preserva importantes artefatos da época colonial.',
    images: [
      'https://images.unsplash.com/photo-1553421982-a8c8b52f3dd7?w=800&h=600&fit=crop'
    ],
    location: {
      address: 'Rua Comandante Costa, 2556',
      city: 'Cuiabá',
      state: 'Mato Grosso',
      coordinates: { lat: -15.5989, lng: -56.0949 }
    },
    categories: ['historia', 'cultura'],
    rating: 4.1,
    reviews: 156,
    priceRange: '$',
    features: ['Exposições Históricas', 'Acervo Militar', 'Visitas Guiadas'],
    activities: ['Visita guiada', 'Exposições interativas'],
    bestSeason: 'O ano todo',
    difficulty: 'Fácil'
  }
];

export const mockGuides: Guide[] = [
  {
    id: '1',
    name: 'Carlos Mendoza',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    description: 'Especialista em ecoturismo no Pantanal com 15 anos de experiência.',
    specialties: ['Pantanal', 'Observação de Fauna', 'Pesca Esportiva'],
    languages: ['Português', 'Inglês', 'Espanhol'],
    rating: 4.9,
    reviews: 127,
    reviewsCount: 127,
    pricePerHour: 80,
    availability: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
    location: 'Poconé, MT',
    verified: true,
    experience: 15,
    cadasturId: 'MT-12345678',
    contact: {
      phone: '(65) 99999-1234',
      email: 'carlos@email.com'
    },
    profileComplete: true,
    profileCompletionPercentage: 100,
    missingFields: []
  },
  {
    id: '2',
    name: 'Ana Silva',
    profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=300&h=300&fit=crop&crop=face',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=300&h=300&fit=crop&crop=face',
    description: 'Guia cultural especializada em história e tradições de Cuiabá.',
    specialties: ['Centro Histórico', 'Gastronomia Local', 'Festas Tradicionais'],
    languages: ['Português', 'Inglês'],
    rating: 4.7,
    reviews: 98,
    reviewsCount: 98,
    pricePerHour: 65,
    availability: ['Segunda', 'Quarta', 'Sexta', 'Sábado', 'Domingo'],
    location: 'Cuiabá, MT',
    verified: true,
    experience: 8,
    cadasturId: 'MT-87654321',
    contact: {
      phone: '(65) 99999-5678',
      email: 'ana@email.com'
    }
  },
  {
    id: '3',
    name: 'Roberto Alves',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
    description: 'Especialista em trilhas e aventuras na Chapada dos Guimarães.',
    specialties: ['Trekking', 'Rapel', 'Cachoeiras', 'Fotografia'],
    languages: ['Português', 'Espanhol'],
    rating: 4.8,
    reviews: 112,
    reviewsCount: 112,
    pricePerHour: 75,
    availability: ['Terça', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
    location: 'Chapada dos Guimarães, MT',
    verified: true,
    experience: 12,
    cadasturId: 'MT-23456789',
    contact: {
      phone: '(65) 99999-9012',
      email: 'roberto@email.com'
    }
  },
  {
    id: '4',
    name: 'Juliana Costa',
    profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
    description: 'Guia especializada em turismo sustentável e experiências com comunidades locais.',
    specialties: ['Ecoturismo', 'Comunidades Tradicionais', 'Artesanato'],
    languages: ['Português', 'Inglês', 'Francês'],
    rating: 4.9,
    reviews: 87,
    reviewsCount: 87,
    pricePerHour: 70,
    availability: ['Segunda', 'Terça', 'Quarta', 'Sábado', 'Domingo'],
    location: 'Nobres, MT',
    verified: true,
    experience: 10,
    cadasturId: 'MT-34567890',
    contact: {
      phone: '(65) 99999-3456',
      email: 'juliana@email.com'
    }
  },
  {
    id: '5',
    name: 'Pedro Santos',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    description: 'Especialista em pesca esportiva e expedições fluviais no Pantanal.',
    specialties: ['Pesca Esportiva', 'Navegação', 'Acampamento'],
    languages: ['Português', 'Inglês'],
    rating: 4.6,
    reviews: 76,
    reviewsCount: 76,
    pricePerHour: 90,
    availability: ['Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
    location: 'Cáceres, MT',
    verified: true,
    experience: 18,
    cadasturId: 'MT-45678901',
    contact: {
      phone: '(65) 99999-7890',
      email: 'pedro@email.com'
    }
  }
];

export const mockItineraries: Itinerary[] = [
  {
    id: '1',
    title: 'Pantanal Adventure - 3 Dias',
    name: 'Pantanal Adventure - 3 Dias',
    description: 'Experiência completa no Pantanal com safáris, pesca e observação da fauna.',
    duration: '3',
    difficulty: 'Moderado',
    price: 450,
    estimatedCost: 450,
    images: [
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1574263867128-a3d5c1b1deaa?w=800&h=600&fit=crop'
    ],
    includes: ['Transporte', 'Hospedagem', 'Refeições', 'Guia Especializado'],
    destinations: ['Pantanal Norte', 'Rio Cuiabá', 'Estrada Parque'],
    spots: [mockTouristSpots[0], mockTouristSpots[1]],
    tags: ['natureza', 'aventura', 'vida-selvagem'],
    guide: {
      name: 'Carlos Mendoza',
      rating: 4.9
    }
  },
  {
    id: '2',
    title: 'Chapada Aventura - 2 Dias',
    name: 'Chapada Aventura - 2 Dias',
    description: 'Explore as mais belas cachoeiras e trilhas da Chapada dos Guimarães.',
    duration: '2',
    difficulty: 'Difícil',
    price: 350,
    estimatedCost: 350,
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop'
    ],
    includes: ['Transporte', 'Hospedagem', 'Café da manhã', 'Guia Especializado'],
    destinations: ['Chapada dos Guimarães', 'Véu de Noiva', 'Cidade de Pedra'],
    spots: [mockTouristSpots[1]],
    tags: ['natureza', 'aventura', 'trekking', 'cachoeiras'],
    guide: {
      name: 'Roberto Alves',
      rating: 4.8
    }
  },
  {
    id: '3',
    title: 'Cuiabá Cultural - 1 Dia',
    name: 'Cuiabá Cultural - 1 Dia',
    description: 'Conheça o centro histórico de Cuiabá e sua rica cultura regional.',
    duration: '1',
    difficulty: 'Fácil',
    price: 120,
    estimatedCost: 120,
    images: [
      'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop'
    ],
    includes: ['Transporte', 'Almoço típico', 'Guia Especializado', 'Ingressos'],
    destinations: ['Centro Histórico de Cuiabá', 'Casa do Artesão', 'Mercado do Porto'],
    spots: [mockTouristSpots[2]],
    tags: ['cultura', 'história', 'gastronomia'],
    guide: {
      name: 'Ana Silva',
      rating: 4.7
    }
  },
  {
    id: '4',
    title: 'Expedição Fluvial - 4 Dias',
    name: 'Expedição Fluvial - 4 Dias',
    description: 'Navegue pelos rios do Pantanal em uma experiência única de pesca e contemplação.',
    duration: '4',
    difficulty: 'Moderado',
    price: 680,
    estimatedCost: 680,
    images: [
      'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'
    ],
    includes: ['Barco', 'Hospedagem', 'Alimentação completa', 'Equipamentos de pesca'],
    destinations: ['Rio Paraguai', 'Baía de Chacororé', 'Porto Jofre'],
    spots: [mockTouristSpots[0]],
    tags: ['pesca', 'natureza', 'navegação', 'pantanal'],
    guide: {
      name: 'Pedro Santos',
      rating: 4.6
    }
  },
  {
    id: '5',
    title: 'Comunidades Tradicionais - 2 Dias',
    name: 'Comunidades Tradicionais - 2 Dias',
    description: 'Visite comunidades tradicionais e aprenda sobre seu modo de vida e artesanato.',
    duration: '2',
    difficulty: 'Fácil',
    price: 280,
    estimatedCost: 280,
    images: [
      'https://images.unsplash.com/photo-1553421982-a8c8b52f3dd7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
    ],
    includes: ['Transporte', 'Hospedagem', 'Alimentação', 'Oficinas de artesanato'],
    destinations: ['Comunidade Ribeirinha São Gonçalo', 'Aldeia Umutina'],
    spots: [mockTouristSpots[3]],
    tags: ['cultura', 'artesanato', 'comunidades', 'sustentabilidade'],
    guide: {
      name: 'Juliana Costa',
      rating: 4.9
    }
  }
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Festival de Inverno de Bonito',
    description: 'Celebração da cultura pantaneira com música, dança e gastronomia típica.',
    date: new Date('2024-07-15T19:00:00'),
    time: '19:00',
    location: {
      name: 'Centro Cultural de Bonito',
      address: 'Rua Coronel Pilad Rebuá, 1907'
    },
    price: 25,
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
    category: 'festival',
    organizer: 'Prefeitura de Bonito'
  },
  {
    id: '2',
    title: 'Festival de Pesca do Pintado',
    description: 'Tradicional festival de pesca esportiva no Rio Paraguai com premiações e shows.',
    date: new Date('2024-08-20T06:00:00'),
    time: '06:00',
    location: {
      name: 'Porto de Cáceres',
      address: 'Av. Getúlio Vargas, s/n - Porto'
    },
    price: 80,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
    category: 'esportivo',
    organizer: 'Associação de Pescadores de Cáceres'
  },
  {
    id: '3',
    title: 'Feira Gastronômica do Cerrado',
    description: 'Degustação de pratos típicos do cerrado com ingredientes nativos e receitas tradicionais.',
    date: new Date('2024-09-10T18:00:00'),
    time: '18:00',
    location: {
      name: 'Praça da República',
      address: 'Centro Histórico de Cuiabá'
    },
    price: 15,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    category: 'gastronomico',
    organizer: 'Secretaria de Turismo de MT'
  },
  {
    id: '4',
    title: 'Mostra Cultural Indígena Bororo',
    description: 'Exposição da rica cultura Bororo com artesanato, danças tradicionais e rituais.',
    date: new Date('2024-09-25T14:00:00'),
    time: '14:00',
    location: {
      name: 'Museu do Rio Aquidauana',
      address: 'Rua Manoel Antonio Paes de Barros, 275'
    },
    price: 0,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    category: 'cultural',
    organizer: 'FUNAI - Fundação Nacional do Índio'
  },
  {
    id: '5',
    title: 'Rodeio de Tradições Pantaneiras',
    description: 'Competição de montaria em touros e cavalos com shows de música sertaneja.',
    date: new Date('2024-10-05T20:00:00'),
    time: '20:00',
    location: {
      name: 'Arena Pantanal Rodeio',
      address: 'Rodovia MT-040, Km 12 - Várzea Grande'
    },
    price: 45,
    image: 'https://images.unsplash.com/photo-1516131206008-dd041a9764fd?w=800&h=600&fit=crop',
    category: 'festival',
    organizer: 'Associação de Rodeio de MT'
  },
  {
    id: '6',
    title: 'Corrida Ecológica da Chapada',
    description: 'Corrida de trail running pelos cenários naturais da Chapada dos Guimarães.',
    date: new Date('2024-10-15T07:00:00'),
    time: '07:00',
    location: {
      name: 'Parque Nacional da Chapada dos Guimarães',
      address: 'Rodovia MT-251, Km 50'
    },
    price: 60,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    category: 'esportivo',
    organizer: 'Clube de Corrida Chapada'
  },
  {
    id: '7',
    title: 'Festival de Música Sertaneja Raiz',
    description: 'Apresentações de duplas tradicionais e novos talentos da música sertaneja.',
    date: new Date('2024-11-02T19:30:00'),
    time: '19:30',
    location: {
      name: 'Arena Pantanal',
      address: 'Av. Agrícola Paes de Barros, s/n'
    },
    price: 120,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
    category: 'festival',
    organizer: 'Produtora Sertão Events'
  },
  {
    id: '8',
    title: 'Encontro de Fotografia da Natureza',
    description: 'Workshop e exposição de fotografia com foco na fauna e flora do Pantanal.',
    date: new Date('2024-11-18T09:00:00'),
    time: '09:00',
    location: {
      name: 'Centro de Convenções Pantanal',
      address: 'Av. Historiador Rubens de Mendonça, 3920'
    },
    price: 35,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop',
    category: 'cultural',
    organizer: 'Associação de Fotógrafos de MT'
  },
  // Novos eventos adicionados
  {
    id: '9',
    title: 'Cuiabá vs Flamengo - Campeonato Brasileiro',
    description: 'Partida válida pela 35ª rodada do Campeonato Brasileiro. Ingressos disponíveis!',
    date: new Date('2024-12-08T16:00:00'),
    time: '16:00',
    location: {
      name: 'Arena Pantanal',
      address: 'Av. Agrícola Paes de Barros, s/n - Verdão'
    },
    price: 45,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop',
    category: 'esportivo',
    organizer: 'Cuiabá Esporte Clube',
    capacity: 44000,
    registered: 32500
  },
  {
    id: '10',
    title: 'Pelada do Fim de Semana - Arena do Povo',
    description: 'Futebol amador aberto para todos os níveis. Venha jogar e se divertir!',
    date: new Date('2024-12-07T08:00:00'),
    time: '08:00',
    location: {
      name: 'Arena do Povo',
      address: 'Rua das Palmeiras, 450 - Cidade Verde'
    },
    price: 15,
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=600&fit=crop',
    category: 'esportivo',
    organizer: 'Associação Esportiva Cidade Verde',
    capacity: 50,
    registered: 28
  },
  {
    id: '11',
    title: 'Torneio de Futsal Pantanal Cup',
    description: 'Campeonato de futsal com times amadores e semi-profissionais. Inscrições abertas!',
    date: new Date('2024-12-14T18:00:00'),
    time: '18:00',
    location: {
      name: 'Ginásio Aecim Tocantins',
      address: 'Av. Fernando Corrêa da Costa, 2367'
    },
    price: 20,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    category: 'esportivo',
    organizer: 'Liga Pantanal de Futsal',
    capacity: 2000,
    registered: 850
  },
  {
    id: '12',
    title: 'Festival de Natal do Pantanal',
    description: 'Celebração natalina com apresentações musicais, feira gastronômica e atividades para toda família.',
    date: new Date('2024-12-15T17:00:00'),
    time: '17:00',
    location: {
      name: 'Praça da República',
      address: 'Centro Histórico de Cuiabá'
    },
    price: 0,
    image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&h=600&fit=crop',
    category: 'festival',
    organizer: 'Prefeitura de Cuiabá'
  },
  {
    id: '13',
    title: 'Show de Verão - Luan Santana',
    description: 'Show exclusivo do cantor Luan Santana em Cuiabá. Ingressos limitados!',
    date: new Date('2024-12-20T21:00:00'),
    time: '21:00',
    location: {
      name: 'Arena Pantanal',
      address: 'Av. Agrícola Paes de Barros, s/n - Verdão'
    },
    price: 180,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
    category: 'festival',
    organizer: 'Live Nation Brasil',
    capacity: 44000,
    registered: 41200
  },
  {
    id: '14',
    title: 'Pelada da Galera - Campo do Bairro',
    description: 'Futebol de campo informal. Traga sua chuteira e venha jogar conosco!',
    date: new Date('2024-12-21T16:00:00'),
    time: '16:00',
    location: {
      name: 'Campo do Jardim Leblon',
      address: 'Rua dos Ipês, 123 - Jardim Leblon'
    },
    price: 10,
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=600&fit=crop',
    category: 'esportivo',
    organizer: 'Galera do Leblon',
    capacity: 30,
    registered: 18
  },
  {
    id: '15',
    title: 'Reveillon Pantanal 2025',
    description: 'Festa de Ano Novo com shows, fogos de artifício e muita diversão para receber 2025!',
    date: new Date('2024-12-31T22:00:00'),
    time: '22:00',
    location: {
      name: 'Orla do Porto',
      address: 'Av. Beira Rio - Centro Geodésico'
    },
    price: 50,
    image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&h=600&fit=crop',
    category: 'festival',
    organizer: 'Prefeitura de Cuiabá',
    capacity: 15000,
    registered: 8500
  },
  {
    id: '16',
    title: 'Campeonato de Beach Soccer',
    description: 'Torneio de futebol de areia com equipes locais. Venha torcer ou participar!',
    date: new Date('2024-12-28T14:00:00'),
    time: '14:00',
    location: {
      name: 'Arena de Beach Soccer',
      address: 'Parque Aquático do Pantanal - Várzea Grande'
    },
    price: 25,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop',
    category: 'esportivo',
    organizer: 'Federação de Beach Soccer MT',
    capacity: 500,
    registered: 320
  },
  {
    id: '17',
    title: 'Feira de Artesanato de Fim de Ano',
    description: 'Exposição e venda de artesanato local, perfeito para presentes de Natal e Ano Novo.',
    date: new Date('2024-12-22T09:00:00'),
    time: '09:00',
    location: {
      name: 'Casa do Artesão',
      address: 'Rua 13 de Junho, 315 - Centro'
    },
    price: 0,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    category: 'cultural',
    organizer: 'Secretaria de Cultura MT'
  },
  {
    id: '18',
    title: 'Torneio de Futebol Society',
    description: 'Campeonato de futebol society com times amadores. Inscrições abertas até o dia do evento!',
    date: new Date('2024-12-29T08:00:00'),
    time: '08:00',
    location: {
      name: 'Centro Esportivo Pantanal',
      address: 'Av. Miguel Sutil, 8000 - Ribeirão do Lipa'
    },
    price: 30,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    category: 'esportivo',
    organizer: 'Liga Society MT',
    capacity: 200,
    registered: 145
  }
];
// Adicionar/atualizar especialidades dos guias para incluir:
// - Trekking/Trilhas
// - Rapel/Escalada  
// - Centro Histórico/História
// - Gastronomia Local/Culinária
// - Festas Tradicionais/Tradições
// - Observação de Fauna
// - Pesca Esportiva
// - Pantanal
