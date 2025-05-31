
export interface TouristSpot {
  id: string;
  name: string;
  description: string;
  category: 'natureza' | 'aventura' | 'cultura' | 'historia';
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    state: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  images: string[];
  rating: number;
  reviews: number;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  features: string[];
  activities: string[];
  bestSeason: string;
  difficulty: 'facil' | 'moderado' | 'dificil';
  contact?: {
    phone?: string;
    website?: string;
    email?: string;
  };
}

export interface Guide {
  id: string;
  name: string;
  photo: string;
  cadasturId: string;
  specialties: string[];
  languages: string[];
  cities: string[];
  rating: number;
  reviews: number;
  pricePerHour: number;
  description: string;
  experience: number; // anos de experiência
  availability: boolean;
  packages: GuidePackage[];
}

export interface GuidePackage {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  includes: string[];
  maxPeople: number;
}

export interface Itinerary {
  id: string;
  name: string;
  description: string;
  duration: number; // em dias
  spots: TouristSpot[];
  estimatedCost: number;
  difficulty: 'facil' | 'moderado' | 'dificil';
  createdBy: string;
  isPublic: boolean;
  tags: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  category: string;
  price: number;
  image: string;
  organizer: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: {
    categories: string[];
    budget: string;
    travelStyle: string;
  };
  savedSpots: string[];
  savedItineraries: string[];
  bookings: Booking[];
}

export interface Booking {
  id: string;
  guideId: string;
  packageId: string;
  date: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalPrice: number;
  participants: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'image' | 'location' | 'booking';
  read: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'event' | 'message' | 'promotion';
  read: boolean;
  timestamp: Date;
  actionUrl?: string;
}
