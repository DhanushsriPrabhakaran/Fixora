import { User, UserRole, Booking, ServiceProvider, ServiceItem, Category, SavedAddress, ChatMessage, Complaint, Offer } from '../types';

const API_BASE_URL = 'http://10.0.2.2:5000/api'; // Android Emulator alias for host localhost

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    if (!response.ok) return null;
    const json = await response.json();
    return json.success ? json.data : null;
  } catch (err) {
    // API server unreachable or offline - returns null for graceful client fallback
    return null;
  }
}

export const apiService = {
  // Auth
  login: async (email: string, password?: string): Promise<User | null> => {
    return request<User>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: password || 'password123' }),
    });
  },

  register: async (userData: Partial<User>): Promise<User | null> => {
    return request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Services & Categories
  getCategories: async (): Promise<Category[] | null> => {
    return request<Category[]>('/services/categories');
  },

  getServices: async (): Promise<ServiceItem[] | null> => {
    return request<ServiceItem[]>('/services');
  },

  // Bookings
  createBooking: async (bookingData: any): Promise<Booking | null> => {
    return request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  getBookings: async (userId?: string): Promise<Booking[] | null> => {
    return request<Booking[]>(`/bookings${userId ? `?customerId=${userId}` : ''}`);
  },

  updateBookingStatus: async (bookingId: string, status: string): Promise<Booking | null> => {
    return request<Booking>(`/bookings/${bookingId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Providers
  getProviders: async (): Promise<ServiceProvider[] | null> => {
    return request<ServiceProvider[]>('/providers');
  },

  // Offers
  getOffers: async (): Promise<Offer[] | null> => {
    return request<Offer[]>('/offers');
  },

  validateOffer: async (code: string, amount: number): Promise<{ code: string; discountAmount: number } | null> => {
    return request<{ code: string; discountAmount: number }>('/offers/validate', {
      method: 'POST',
      body: JSON.stringify({ code, amount }),
    });
  },

  // Messages / Chat
  getMessages: async (bookingId: string): Promise<ChatMessage[] | null> => {
    return request<ChatMessage[]>(`/chat/${bookingId}`);
  },

  sendMessage: async (msgData: any): Promise<ChatMessage | null> => {
    return request<ChatMessage>('/chat', {
      method: 'POST',
      body: JSON.stringify(msgData),
    });
  },

  // Complaints
  createComplaint: async (complaintData: any): Promise<Complaint | null> => {
    return request<Complaint>('/complaints', {
      method: 'POST',
      body: JSON.stringify(complaintData),
    });
  },

  getComplaints: async (userId?: string): Promise<Complaint[] | null> => {
    return request<Complaint[]>(`/complaints${userId ? `?userId=${userId}` : ''}`);
  },

  // Admin
  getAdminAnalytics: async (): Promise<any | null> => {
    return request<any>('/admin/analytics');
  },

  verifyProvider: async (providerId: string, approve: boolean): Promise<any | null> => {
    return request<any>(`/admin/provider/${providerId}/verify`, {
      method: 'PATCH',
      body: JSON.stringify({ approve }),
    });
  }
};
