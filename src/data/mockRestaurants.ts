
import { Restaurant } from '@/types/restaurant';

export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Casa do Peixe Pintado',
    description: 'Especializada em peixes do Pantanal, oferece pratos tradicionais com ingredientes frescos da região',
    cuisine: 'pantaneira',
    location: {
      lat: -15.601,
      lng: -56.097,
      address: 'Rua das Palmeiras, 123',
      city: 'Cuiabá',
      state: 'MT'
    },
    images: [
      'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop'
    ],
    rating: 4.8,
    reviews: 156,
    priceRange: '$$$',
    specialties: ['Pintado na Brasa', 'Pacu Assado', 'Farofa de Banana', 'Piranha Caldo'],
    features: ['Vista para o Rio', 'Ambiente Familiar', 'Música Ao Vivo', 'Estacionamento'],
    openingHours: {
      'Segunda': 'Fechado',
      'Terça-Sexta': '11:00 - 22:00',
      'Sábado-Domingo': '11:00 - 23:00'
    },
    contact: {
      phone: '(65) 3322-1234',
      instagram: '@casadopeixepintado'
    },
    averagePrice: 85,
    deliveryAvailable: false
  },
  {
    id: '2',
    name: 'Churrascaria do Cerrado',
    description: 'A melhor carne do Centro-Oeste com cortes nobres e buffet completo de saladas',
    cuisine: 'churrascaria',
    location: {
      lat: -15.595,
      lng: -56.115,
      address: 'Av. dos Bandeirantes, 456',
      city: 'Cuiabá',
      state: 'MT'
    },
    images: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop'
    ],
    rating: 4.6,
    reviews: 203,
    priceRange: '$$$$',
    specialties: ['Picanha Premium', 'Cupim na Brasa', 'Linguiça Artesanal', 'Costela 12h'],
    features: ['Buffet Completo', 'Ar Condicionado', 'Valet Parking', 'Espaço Kids'],
    openingHours: {
      'Segunda': 'Fechado',
      'Terça-Domingo': '18:00 - 23:30'
    },
    contact: {
      phone: '(65) 3355-7890',
      website: 'www.churrascodocerrrado.com.br'
    },
    averagePrice: 120,
    deliveryAvailable: false
  },
  {
    id: '4',
    name: 'Sabores do Cerrado',
    description: 'Restaurante regional com ingredientes nativos e pratos que contam a história do Cerrado',
    cuisine: 'regional',
    location: {
      lat: -15.610,
      lng: -56.120,
      address: 'Rua do Pequi, 321',
      city: 'Cuiabá',
      state: 'MT'
    },
    images: [
      'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop'
    ],
    rating: 4.9,
    reviews: 67,
    priceRange: '$$',
    specialties: ['Galinhada com Pequi', 'Pacu com Mandioca', 'Doce de Caju', 'Suco de Cagaita'],
    features: ['Ingredientes Nativos', 'Educação Gastronômica', 'Ambiente Rústico', 'Produtos Locais'],
    openingHours: {
      'Segunda-Sexta': '11:30 - 14:30, 18:00 - 22:00',
      'Sábado-Domingo': '11:30 - 22:00'
    },
    contact: {
      phone: '(65) 3366-9012',
      website: 'www.saboresdocerrado.com.br'
    },
    averagePrice: 55,
    deliveryAvailable: true
  },
  {
    id: '5',
    name: 'Doceria Pantaneira',
    description: 'Doces tradicionais de Mato Grosso com ingredientes regionais e receitas da vovó',
    cuisine: 'doceria',
    location: {
      lat: -15.590,
      lng: -56.080,
      address: 'Rua dos Doces, 156',
      city: 'Cuiabá',
      state: 'MT'
    },
    images: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1557979619-445218f326cf?w=800&h=600&fit=crop'
    ],
    rating: 4.8,
    reviews: 94,
    priceRange: '$',
    specialties: ['Furrundu', 'Pacu Doce', 'Raspadinha', 'Doce de Leite de Búfala'],
    features: ['Receitas Tradicionais', 'Ingredientes Regionais', 'Ambiente Acolhedor', 'Encomendas'],
    openingHours: {
      'Segunda-Sábado': '08:00 - 18:00',
      'Domingo': '08:00 - 12:00'
    },
    contact: {
      phone: '(65) 3377-2345',
      instagram: '@doceriapantaneira'
    },
    averagePrice: 25,
    deliveryAvailable: true
  },
  {
    id: '6',
    name: 'Café do Centro',
    description: 'Cafeteria artesanal com grãos do cerrado e ambiente aconchegante para trabalhar ou relaxar',
    cuisine: 'cafe',
    location: {
      lat: -15.600,
      lng: -56.095,
      address: 'Rua Barão de Melgaço, 987',
      city: 'Cuiabá',
      state: 'MT'
    },
    images: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop'
    ],
    rating: 4.5,
    reviews: 128,
    priceRange: '$$',
    specialties: ['Café do Cerrado', 'Cappuccino', 'Pão de Açúcar', 'Bolo de Pequi'],
    features: ['Wi-Fi Grátis', 'Ambiente Silencioso', 'Grãos Especiais', 'Espaço Coworking'],
    openingHours: {
      'Segunda-Sexta': '06:30 - 22:00',
      'Sábado-Domingo': '08:00 - 20:00'
    },
    contact: {
      phone: '(65) 3388-4567',
      website: 'www.cafedocentro.com.br'
    },
    averagePrice: 35,
    deliveryAvailable: true
  },
  {
    id: '7',
    name: 'Lanchonete do Bairro',
    description: 'Lanches caseiros e sucos naturais com o melhor preço da região',
    cuisine: 'lanchonete',
    location: {
      lat: -15.605,
      lng: -56.085,
      address: 'Rua das Flores, 234',
      city: 'Cuiabá',
      state: 'MT'
    },
    images: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&h=600&fit=crop'
    ],
    rating: 4.2,
    reviews: 76,
    priceRange: '$',
    specialties: ['X-Burguer Pantaneiro', 'Vitamina de Açaí', 'Pastel de Queijo', 'Caldo de Cana'],
    features: ['Preço Justo', 'Atendimento Rápido', 'Ambiente Familiar'],
    openingHours: {
      'Segunda-Sábado': '17:00 - 23:00',
      'Domingo': 'Fechado'
    },
    contact: {
      phone: '(65) 3399-8765'
    },
    averagePrice: 18,
    deliveryAvailable: true
  },
  {
    id: '8',
    name: 'Pamonharia da Vovó',
    description: 'Pamonhas doces e salgadas feitas na hora com milho fresco da região',
    cuisine: 'pamonharia',
    location: {
      lat: -15.585,
      lng: -56.110,
      address: 'Av. do Milho, 445',
      city: 'Cuiabá',
      state: 'MT'
    },
    images: [
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800&h=600&fit=crop'
    ],
    rating: 4.6,
    reviews: 143,
    priceRange: '$',
    specialties: ['Pamonha Doce', 'Pamonha de Queijo', 'Curau', 'Milho Cozido'],
    features: ['Feita na Hora', 'Milho Fresco', 'Receita Tradicional', 'Ambiente Rústico'],
    openingHours: {
      'Quarta-Domingo': '15:00 - 22:00',
      'Segunda-Terça': 'Fechado'
    },
    contact: {
      phone: '(65) 3311-5432'
    },
    averagePrice: 12,
    deliveryAvailable: false
  },
  {
    id: '9',
    name: 'Rodízio Sertanejo',
    description: 'Rodízio de carnes com buffet completo e música sertaneja ao vivo',
    cuisine: 'rodizio',
    location: {
      lat: -15.615,
      lng: -56.125,
      address: 'Rod. BR-163, Km 8',
      city: 'Cuiabá',
      state: 'MT'
    },
    images: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
    ],
    rating: 4.4,
    reviews: 189,
    priceRange: '$$$',
    specialties: ['Costela no Bafo', 'Linguiça Toscana', 'Frango Caipira', 'Buffet Completo'],
    features: ['Música Ao Vivo', 'Ambiente Familiar', 'Estacionamento Amplo', 'Shows'],
    openingHours: {
      'Quinta-Domingo': '18:00 - 01:00',
      'Segunda-Quarta': 'Fechado'
    },
    contact: {
      phone: '(65) 3322-7890',
      instagram: '@rodiziosertanejo'
    },
    averagePrice: 95,
    deliveryAvailable: false
  },
  {
    id: '10',
    name: 'Feira do Produtor',
    description: 'Produtos frescos direto do produtor com frutas, verduras e comidas típicas',
    cuisine: 'feira',
    location: {
      lat: -15.575,
      lng: -56.065,
      address: 'Praça da República, s/n',
      city: 'Cuiabá',
      state: 'MT'
    },
    images: [
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=800&h=600&fit=crop'
    ],
    rating: 4.3,
    reviews: 234,
    priceRange: '$',
    specialties: ['Frutas da Estação', 'Temperos Frescos', 'Comida de Rua', 'Produtos Orgânicos'],
    features: ['Produtos Frescos', 'Preços Baixos', 'Variedade', 'Ambiente Familiar'],
    openingHours: {
      'Sábado': '05:00 - 12:00',
      'Domingo': '06:00 - 11:00',
      'Segunda-Sexta': 'Fechado'
    },
    contact: {
      phone: '(65) 3333-1122'
    },
    averagePrice: 8,
    deliveryAvailable: false
  }
];

export const cuisineCategories = [
  { id: 'todas', name: 'Todas', icon: '🍽️', count: mockRestaurants.length },
  { id: 'tradicional', name: 'Tradicional', icon: '🏠', count: mockRestaurants.filter(r => r.cuisine === 'tradicional').length },
  { id: 'pantaneira', name: 'Pantaneira', icon: '🐟', count: mockRestaurants.filter(r => r.cuisine === 'pantaneira').length },
  { id: 'churrascaria', name: 'Churrascaria', icon: '🥩', count: mockRestaurants.filter(r => r.cuisine === 'churrascaria').length },
  { id: 'regional', name: 'Regional', icon: '🌿', count: mockRestaurants.filter(r => r.cuisine === 'regional').length },
  { id: 'doceria', name: 'Doceria', icon: '🧁', count: mockRestaurants.filter(r => r.cuisine === 'doceria').length },
  { id: 'cafe', name: 'Café', icon: '☕', count: mockRestaurants.filter(r => r.cuisine === 'cafe').length },
  { id: 'lanchonete', name: 'Lanchonete', icon: '🍔', count: mockRestaurants.filter(r => r.cuisine === 'lanchonete').length },
  { id: 'pamonharia', name: 'Pamonharia', icon: '🌽', count: mockRestaurants.filter(r => r.cuisine === 'pamonharia').length },
  { id: 'rodizio', name: 'Rodízio', icon: '🍖', count: mockRestaurants.filter(r => r.cuisine === 'rodizio').length },
  { id: 'feira', name: 'Feira', icon: '🛒', count: mockRestaurants.filter(r => r.cuisine === 'feira').length },
];
