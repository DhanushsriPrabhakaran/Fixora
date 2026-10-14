import { User, UserRole, Booking, ServiceProvider, ServiceItem, Category, SavedAddress, ChatMessage, Complaint, Offer } from '../types';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  isNetworkError?: boolean;
}

const BASE_URL_CANDIDATES = [
  'http://localhost:5000/api',
  'http://10.0.2.2:5000/api',
  'http://10.10.32.32:5000/api',
  'http://127.0.0.1:5000/api',
];

let workingBaseUrl: string | null = null;

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const urlsToTry = workingBaseUrl ? [workingBaseUrl, ...BASE_URL_CANDIDATES.filter(u => u !== workingBaseUrl)] : BASE_URL_CANDIDATES;

  for (const baseUrl of urlsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`${baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
        ...options,
      });
      clearTimeout(timeoutId);

      workingBaseUrl = baseUrl;
      let json: any = {};
      try {
        json = await response.json();
      } catch (e) {}

      if (!response.ok || (json && json.success === false)) {
        return {
          success: false,
          message: json.message || `Server error (${response.status})`,
        };
      }

      return {
        success: true,
        data: json.data !== undefined ? json.data : json,
        message: json.message,
      };
    } catch (err) {
      // Try next candidate URL
    }
  }

  return {
    success: false,
    message: 'Backend server is unreachable.',
    isNetworkError: true,
  };
}

export const apiService = {
  // Auth & Users
  login: async (email: string, password?: string, role?: UserRole): Promise<ApiResponse<User>> => {
    return request<User>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
  },

  register: async (userData: Record<string, any>): Promise<ApiResponse<User>> => {
    return request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  resetPassword: async (email: string, newPassword: string): Promise<ApiResponse<any>> => {
    return request<any>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, newPassword }),
    });
  },

  getUsers: async (): Promise<User[] | null> => {
    const res = await request<User[]>('/auth/users');
    return res.success ? (res.data || []) : null;
  },

  // Services & Categories
  getCategories: async (): Promise<Category[] | null> => {
    const res = await request<Category[]>('/services/categories');
    return res.success ? (res.data || []) : null;
  },

  getServices: async (): Promise<ServiceItem[] | null> => {
    const res = await request<ServiceItem[]>('/services');
    return res.success ? (res.data || []) : null;
  },

  // Bookings
  createBooking: async (bookingData: any): Promise<Booking | null> => {
    const res = await request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
    return res.success ? (res.data || null) : null;
  },

  getBookings: async (userId?: string): Promise<Booking[] | null> => {
    const res = await request<Booking[]>(`/bookings${userId ? `?customerId=${userId}` : ''}`);
    return res.success ? (res.data || []) : null;
  },

  updateBookingStatus: async (bookingId: string, status: string): Promise<Booking | null> => {
    const res = await request<Booking>(`/bookings/${bookingId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return res.success ? (res.data || null) : null;
  },

  // Providers
  getProviders: async (categoryType?: string): Promise<ServiceProvider[] | null> => {
    const query = categoryType ? `?categoryType=${categoryType}` : '';
    const res = await request<ServiceProvider[]>(`/providers${query}`);
    return res.success ? (res.data || []) : null;
  },

  submitVerification: async (providerId: string, idProof: string, certificationProof: string): Promise<ServiceProvider | null> => {
    const res = await request<ServiceProvider>('/providers/verify-submit', {
      method: 'POST',
      body: JSON.stringify({ providerId, idProof, certificationProof }),
    });
    return res.success ? (res.data || null) : null;
  },

  addReview: async (reviewData: { providerId: string; rating: number; comment: string; serviceName: string; customerId: string; customerName: string }): Promise<ServiceProvider | null> => {
    const res = await request<ServiceProvider>('/providers/review', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
    return res.success ? (res.data || null) : null;
  },

  // Offers
  getOffers: async (): Promise<Offer[] | null> => {
    const res = await request<Offer[]>('/offers');
    return res.success ? (res.data || []) : null;
  },

  validateOffer: async (code: string, amount: number): Promise<{ code: string; discountAmount: number } | null> => {
    const res = await request<{ code: string; discountAmount: number }>('/offers/validate', {
      method: 'POST',
      body: JSON.stringify({ code, amount }),
    });
    return res.success ? (res.data || null) : null;
  },

  // Messages / Chat
  getMessages: async (bookingId: string): Promise<ChatMessage[] | null> => {
    const res = await request<ChatMessage[]>(`/chat/${bookingId}`);
    return res.success ? (res.data || []) : null;
  },

  sendMessage: async (msgData: any): Promise<ChatMessage | null> => {
    const res = await request<ChatMessage>('/chat', {
      method: 'POST',
      body: JSON.stringify(msgData),
    });
    return res.success ? (res.data || null) : null;
  },

  // Complaints
  createComplaint: async (complaintData: any): Promise<Complaint | null> => {
    const res = await request<Complaint>('/complaints', {
      method: 'POST',
      body: JSON.stringify(complaintData),
    });
    return res.success ? (res.data || null) : null;
  },

  getComplaints: async (userId?: string): Promise<Complaint[] | null> => {
    const res = await request<Complaint[]>(`/complaints${userId ? `?userId=${userId}` : ''}`);
    return res.success ? (res.data || []) : null;
  },

  // Admin
  getAdminAnalytics: async (): Promise<any | null> => {
    const res = await request<any>('/admin/analytics');
    return res.success ? (res.data || null) : null;
  },

  verifyProvider: async (providerId: string, approve: boolean): Promise<any | null> => {
    const res = await request<any>(`/admin/provider/${providerId}/verify`, {
      method: 'PATCH',
      body: JSON.stringify({ approve }),
    });
    return res.success ? (res.data || null) : null;
  }
};

