
export interface TouristSpot {
  id: string;
  name: string;
  description: string;
  images: string[];
  location: {
    address: string;
    city: string;
    state: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  categories: string[];
  rating: number;
  reviews: number;
  priceRange: string;
  features: string[];
  activities: string[];
  bestSeason: string;
  difficulty: string;
  openingHours?: {
    [key: string]: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
}

export interface Guide {
  id: string;
  name: string;
  profilePicture: string;
  description: string;
  specialties: string[];
  languages: string[];
  rating: number;
  reviews: number;
  reviewsCount: number;
  pricePerHour: number;
  availability: string[];
  location: string;
  verified: boolean;
  experience: number;
  cadasturId: string;
  photo: string;
  contact: {
    phone: string;
    email: string;
  };
  profileComplete?: boolean;
  profileCompletionPercentage?: number;
  missingFields?: string[];
}

export interface Itinerary {
  id: string;
  title: string;
  name: string;
  description: string;
  duration: string;
  difficulty: 'Fácil' | 'Moderado' | 'Difícil';
  price: number;
  estimatedCost: number;
  images: string[];
  includes: string[];
  destinations: string[];
  spots: TouristSpot[];
  tags: string[];
  guide?: {
    name: string;
    rating: number;
  };
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: {
    name: string;
    address: string;
  };
  price: number;
  image: string;
  category: string;
  organizer: string;
  capacity?: number;
  registered?: number;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  priceRange: string;
  rating: number;
  reviews: number;
  image: string;
  location: {
    address: string;
    city: string;
  };
  features: string[];
  openingHours: {
    [key: string]: string;
  };
  contact: {
    phone: string;
    website?: string;
  };
}
