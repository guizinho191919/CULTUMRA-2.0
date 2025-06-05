export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: 'tradicional' | 'pantaneira' | 'churrascaria' | 'regional' | 'doceria' | 'cafe' | 'lanchonete' | 'pamonharia' | 'rodizio' | 'feira';
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    state: string;
  };
  images: string[];
  rating: number;
  reviews: number;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  specialties: string[];
  features: string[];
  openingHours: {
    [key: string]: string;
  };
  contact: {
    phone?: string;
    website?: string;
    instagram?: string;
  };
  averagePrice: number;
  deliveryAvailable: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isVegetarian?: boolean;
  isTraditional?: boolean;
}
