
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
  categories: string[]; // Changed from 'category' to 'categories' array
  rating: number;
  reviews: number;
  priceRange: string;
  features: string[];
  activities: string[]; // Added missing property
  bestSeason: string; // Added missing property
  difficulty: string; // Added missing property
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
  reviews: number; // Added missing property (was reviewsCount)
  reviewsCount: number;
  pricePerHour: number;
  availability: string[];
  location: string;
  verified: boolean;
  experience: number;
  cadasturId: string; // Added missing property
  photo: string; // Added missing property
  contact: {
    phone: string;
    email: string;
  };
}

export interface Itinerary {
  id: string;
  title: string;
  name: string; // Added missing property
  description: string;
  duration: string;
  difficulty: 'Fácil' | 'Moderado' | 'Difícil';
  price: number;
  estimatedCost: number; // Added missing property
  images: string[];
  includes: string[];
  destinations: string[];
  spots: TouristSpot[]; // Added missing property
  tags: string[]; // Added missing property
  guide?: {
    name: string;
    rating: number;
  };
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date; // Changed from string to Date
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
