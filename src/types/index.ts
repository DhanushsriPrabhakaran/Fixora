export type UserRole = 'customer' | 'provider' | 'admin';

export type VerificationStatus = 'not_submitted' | 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  address: string;
  profileImage: string;
  city?: string;
  token?: string;
  password?: string;
  verificationStatus?: VerificationStatus;
}

export type ServiceCategoryType = 'home' | 'elder_care' | 'child_care';

export interface Category {
  id: string;
  name: string;
  type: ServiceCategoryType;
  icon: string;
  description: string;
  itemCount: number;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  categoryType: ServiceCategoryType;
  description: string;
  startingPrice: number;
  unit: string; // e.g. '/hr', '/job', '/visit'
  rating: number;
  icon: string;
  image: string;
  popular?: boolean;
}

export interface ProviderReview {
  id: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  serviceName: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  profileImage: string;
  tagline: string;
  categoryType: ServiceCategoryType;
  servicesOffered: string[]; // Service IDs
  experienceYears: number;
  qualifications: string[];
  certifications: string[];
  languages: string[];
  rating: number;
  reviewsCount: number;
  verified: boolean;
  availabilityStatus: 'Available Today' | 'Available Tomorrow' | 'Busy';
  startingPrice: number;
  serviceArea: string;
  bio: string;
  emergencySupport?: boolean;
  supportedAgeGroups?: string[]; // For child care (e.g. "0-2 yrs", "3-6 yrs", "7+ yrs")
  reviews: ProviderReview[];
  earnings?: {
    total: number;
    withdrawable: number;
    pending: number;
  };
  documentsSubmitted?: {
    idProof?: string;
    certificationProof?: string;
    submittedAt?: string;
  };
}

export type BookingStatus = 
  | 'confirmed' 
  | 'provider_assigned' 
  | 'on_the_way' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled'
  | 'disputed';

export interface Booking {
  id: string;
  customerId: string;
  providerId: string;
  serviceId: string;
  serviceName: string;
  providerName: string;
  providerImage: string;
  categoryType: ServiceCategoryType;
  date: string;
  timeSlot: string;
  address: string;
  landmark?: string;
  status: BookingStatus;
  serviceCharge: number;
  additionalCharge: number;
  discountAmount?: number;
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
  ratingGiven?: number;
  specialInstructions?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'booking' | 'system' | 'reminder' | 'review';
  bookingId?: string;
}

export interface FilterOptions {
  categoryType?: ServiceCategoryType;
  selectedCategory?: string;
  searchQuery: string;
  minRating: number;
  maxPrice: number;
  verifiedOnly: boolean;
  availabilityOnly: boolean;
}

export interface SavedAddress {
  id: string;
  title: string; // e.g. Home, Work, Parent's Place
  name: string;
  phone: string;
  street: string;
  area: string;
  city: string;
  zipCode: string;
  landmark?: string;
  isDefault: boolean;
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  category: string;
  subject: string;
  description: string;
  status: 'open' | 'under_review' | 'resolved' | 'rejected';
  adminResolution?: string;
  createdAt: string;
}

export interface Offer {
  code: string;
  title: string;
  description: string;
  discountPercentage: number;
  maxDiscount: number;
  minBookingAmount: number;
  validUntil: string;
}
