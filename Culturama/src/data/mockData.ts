
import { TouristSpot, Guide, Itinerary, Event } from '@/types';

export const mockTouristSpots: TouristSpot[] = [
  {
    id: '1',
    name: 'Pantanal Norte',
    description: 'Maior planície alagável do mundo, lar de uma biodiversidade única com jacarés, onças-pintadas, capivaras e centenas de espécies de aves.',
    category: 'natureza',
    location: {
      lat: -16.3394,
      lng: -56.4664,
      address: 'Transpantaneira, Poconé - MT',
      city: 'Poconé',
      state: 'Mato Grosso',
      coordinates: {
        lat: -16.3394,
        lng: -56.4664
      }
    },
    images: [
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518877593221-1f28583780b4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&h=600&fit=crop'
    ],
    rating: 4.8,
    reviews: 1247,
    priceRange: '$$',
    features: ['Safari', 'Pesca', 'Observação de Aves', 'Trilhas'],
    activities: ['Safari Fotográfico', 'Pesca Esportiva', 'Observação de Aves', 'Trilhas Ecológicas', 'Passeio de Barco'],
    bestSeason: 'Maio a Setembro (estação seca)',
    difficulty: 'moderado',
    contact: {
      phone: '(65) 3344-5566',
      website: 'www.pantanalnorte.com.br'
    }
  },
  {
    id: '2',
    name: 'Chapada dos Guimarães',
    description: 'Impressionante formação rochosa com cachoeiras cristalinas, mirantes espetaculares e rica fauna do cerrado brasileiro.',
    category: 'aventura',
    location: {
      lat: -15.4618,
      lng: -55.7383,
      address: 'Centro Geodésico, Chapada dos Guimarães - MT',
      city: 'Chapada dos Guimarães',
      state: 'Mato Grosso',
      coordinates: {
        lat: -15.4618,
        lng: -55.7383
      }
    },
    images: [
      'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&h=600&fit=crop'
    ],
    rating: 4.7,
    reviews: 892,
    priceRange: '$$$',
    features: ['Rapel', 'Trekking', 'Banho de Cachoeira', 'Contemplação'],
    activities: ['Rapel', 'Trekking', 'Banho de Cachoeira', 'Contemplação', 'Escalada', 'Espeleologia'],
    bestSeason: 'Abril a Setembro (menor volume de chuvas)',
    difficulty: 'dificil',
    contact: {
      phone: '(65) 3301-1234',
      website: 'www.chapadaguias.com.br'
    }
  },
  {
    id: '3',
    name: 'Casa do Artesão',
    description: 'Centro cultural que preserva e promove o artesanato tradicional de Mato Grosso, com peças únicas da cultura local.',
    category: 'cultura',
    location: {
      lat: -15.5989,
      lng: -56.0949,
      address: 'Rua 13 de Junho, 315 - Centro, Cuiabá - MT',
      city: 'Cuiabá',
      state: 'Mato Grosso',
      coordinates: {
        lat: -15.5989,
        lng: -56.0949
      }
    },
    images: [
      'https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1473091534298-04dcbce3278c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&h=600&fit=crop'
    ],
    rating: 4.3,
    reviews: 324,
    priceRange: '$',
    features: ['Exposições', 'Oficinas', 'Loja de Souvenirs', 'Café Cultural'],
    activities: ['Visita às Exposições', 'Participação em Oficinas', 'Compras de Artesanato', 'Degustação Cultural'],
    bestSeason: 'Todo o ano',
    difficulty: 'facil',
    contact: {
      phone: '(65) 3313-1821',
      email: 'contato@casaartesao.mt.gov.br'
    }
  },
  {
    id: '4',
    name: 'Arsenal de Guerra',
    description: 'Museu histórico que conta a história militar de Mato Grosso e preserva importantes artefatos da região.',
    category: 'historia',
    location: {
      lat: -15.6014,
      lng: -56.0978,
      address: 'Av. Beira Rio, Cuiabá - MT',
      city: 'Cuiabá',
      state: 'Mato Grosso',
      coordinates: {
        lat: -15.6014,
        lng: -56.0978
      }
    },
    images: [
      'https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=800&h=600&fit=crop'
    ],
    rating: 4.1,
    reviews: 156,
    priceRange: '$',
    features: ['Museu', 'Visita Guiada', 'Vista do Rio', 'Centro Histórico'],
    activities: ['Visita ao Museu', 'Tour Histórico', 'Contemplação do Rio', 'Fotografia Histórica'],
    bestSeason: 'Todo o ano',
    difficulty: 'facil'
  }
];

export const mockGuides: Guide[] = [
  {
    id: '1',
    name: 'Carlos Pantaneiro',
    photo: '/placeholder.svg',
    cadasturId: 'MT001234',
    specialties: ['Pantanal', 'Pesca Esportiva', 'Fotografia de Natureza'],
    languages: ['Português', 'Inglês', 'Espanhol'],
    cities: ['Poconé', 'Cáceres', 'Corumbá'],
    rating: 4.9,
    reviews: 187,
    pricePerHour: 120,
    description: 'Guia especializado no Pantanal com 15 anos de experiência. Conhece todos os melhores pontos para observação de fauna.',
    experience: 15,
    availability: true,
    packages: [
      {
        id: 'p1',
        name: 'Safari Pantanal - 1 Dia',
        description: 'Tour completo pelo Pantanal com almoço incluso',
        duration: '8 horas',
        price: 450,
        includes: ['Transporte', 'Almoço', 'Guia especializado', 'Equipamentos'],
        maxPeople: 6
      }
    ]
  },
  {
    id: '2',
    name: 'Ana Chapada',
    photo: '/placeholder.svg',
    cadasturId: 'MT005678',
    specialties: ['Chapada dos Guimarães', 'Trekking', 'Cachoeiras'],
    languages: ['Português', 'Inglês'],
    cities: ['Chapada dos Guimarães', 'Cuiabá'],
    rating: 4.8,
    reviews: 143,
    pricePerHour: 100,
    description: 'Especialista em trilhas e cachoeiras da Chapada dos Guimarães. Bióloga formada com paixão pelo ecoturismo.',
    experience: 8,
    availability: true,
    packages: [
      {
        id: 'p2',
        name: 'Trilha das Cachoeiras',
        description: 'Visita às principais cachoeiras da região',
        duration: '6 horas',
        price: 320,
        includes: ['Guia', 'Lanche', 'Equipamentos de segurança'],
        maxPeople: 8
      }
    ]
  }
];

export const mockItineraries: Itinerary[] = [
  {
    id: '1',
    name: 'Pantanal Completo - 5 Dias',
    description: 'Roteiro completo pelo Pantanal Norte com foco em observação de fauna e pesca esportiva.',
    duration: 5,
    spots: [mockTouristSpots[0], mockTouristSpots[1]],
    estimatedCost: 2500,
    difficulty: 'moderado',
    createdBy: 'user1',
    isPublic: true,
    tags: ['natureza', 'safari', 'pesca', 'fotografia']
  },
  {
    id: '2',
    name: 'Aventura na Chapada - 3 Dias',
    description: 'Roteiro de aventura com trilhas, rapel e banhos de cachoeira na Chapada dos Guimarães.',
    duration: 3,
    spots: [mockTouristSpots[1]],
    estimatedCost: 1200,
    difficulty: 'dificil',
    createdBy: 'user2',
    isPublic: true,
    tags: ['aventura', 'trilha', 'cachoeira', 'rapel']
  },
  {
    id: '3',
    name: 'Cultura e História - 2 Dias',
    description: 'Imersão na cultura e história de Mato Grosso visitando museus, centros culturais e sítios históricos.',
    duration: 2,
    spots: [mockTouristSpots[2], mockTouristSpots[3]],
    estimatedCost: 400,
    difficulty: 'facil',
    createdBy: 'user3',
    isPublic: true,
    tags: ['cultura', 'historia', 'museu', 'artesanato']
  }
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Festival de Inverno de Bonito',
    description: 'Festival anual com shows, gastronomia e atividades culturais na temporada seca.',
    date: new Date(2024, 6, 15, 19, 0), // 15 de julho às 19h
    location: {
      lat: -20.7289,
      lng: -56.4892,
      address: 'Centro de Bonito - MS'
    },
    category: 'Cultura',
    price: 0,
    image: '/placeholder.svg',
    organizer: 'Prefeitura de Bonito'
  },
  {
    id: '2',
    title: 'Expedição Fotográfica Pantanal',
    description: 'Workshop de fotografia de natureza com fotógrafos profissionais no Pantanal.',
    date: new Date(2024, 7, 20, 6, 0), // 20 de agosto às 6h
    location: {
      lat: -16.3394,
      lng: -56.4664,
      address: 'Transpantaneira, Poconé - MT'
    },
    category: 'Workshop',
    price: 850,
    image: '/placeholder.svg',
    organizer: 'Foto Selvagem'
  }
];

export const categories = [
  { id: 'todos', name: 'Todos', icon: '🌟', count: mockTouristSpots.length },
  { id: 'natureza', name: 'Natureza', icon: '🌿', count: mockTouristSpots.filter(s => s.category === 'natureza').length },
  { id: 'aventura', name: 'Aventura', icon: '🏔️', count: mockTouristSpots.filter(s => s.category === 'aventura').length },
  { id: 'cultura', name: 'Cultura', icon: '🎭', count: mockTouristSpots.filter(s => s.category === 'cultura').length },
  { id: 'historia', name: 'História', icon: '🏛️', count: mockTouristSpots.filter(s => s.category === 'historia').length }
];
