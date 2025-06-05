
export type UserRole = 'admin' | 'content_manager' | 'financial' | 'guide' | 'tourist';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
  lastLogin?: Date;
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  type: 'tourist' | 'guide';
  status: 'active' | 'pending' | 'suspended';
  balance: number;
  createdAt: string;
  profileImage?: string;
  phone?: string;
  location?: string;
  specialties?: string[];
  cadastur?: string;
  rating?: number;
  reviewsCount?: number;
}

export interface Spot {
  id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  images: string[];
  category: string;
  status: 'active' | 'pending' | 'inactive';
  featured: boolean;
  rating: number;
  reviewsCount: number;
  createdAt: string;
}

export interface Itinerary {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  guideId: string;
  guideName: string;
  maxParticipants: number;
  currentParticipants: number;
  status: 'active' | 'pending' | 'inactive';
  featured: boolean;
  images: string[];
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  maxParticipants: number;
  currentParticipants: number;
  status: 'active' | 'pending' | 'cancelled';
  featured: boolean;
  category: string;
  createdAt: string;
}

export interface Reservation {
  id: string;
  userId: string;
  userName: string;
  itemId: string;
  itemName: string;
  itemType: 'spot' | 'itinerary' | 'event';
  date: string;
  participants: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
}

export interface AdminStats {
  totalReservations: number;
  pendingReservations: number;
  confirmedReservations: number;
  totalRevenue: number;
  newUsers: number;
  newGuides: number;
  activeCoupons: number;
  totalBackpacks: number;
}

export interface AdminAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

export interface AdminModule {
  id: string;
  name: string;
  icon: string;
  path: string;
  permissions: string[];
  description?: string;
}
