import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  User, 
  UserRole, 
  Booking, 
  SavedAddress, 
  ServiceProvider, 
  ServiceItem, 
  Complaint, 
  ChatMessage, 
  ProviderReview,
  BookingStatus 
} from '../types';
import { MOCK_PROVIDERS, MOCK_SERVICES, INITIAL_BOOKINGS, INITIAL_NOTIFICATIONS } from '../data/mockData';

const STORAGE_KEYS = {
  USERS: '@fixora_db_users',
  BOOKINGS: '@fixora_db_bookings',
  ADDRESSES: '@fixora_db_addresses',
  PROVIDERS: '@fixora_db_providers',
  SERVICES: '@fixora_db_services',
  COMPLAINTS: '@fixora_db_complaints',
  MESSAGES: '@fixora_db_messages',
  CURRENT_USER: '@fixora_db_current_user',
};

// Default Seed Accounts
const DEFAULT_USERS: User[] = [
  {
    id: 'cust_101',
    name: 'Dhanush',
    email: 'dhanush@example.com',
    phone: '+1 (555) 234-5678',
    role: 'customer',
    address: '42 Maplewood Avenue, Suite 4B',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    city: 'New York Metro',
    verificationStatus: 'not_submitted',
  },
  {
    id: 'prv_101',
    name: 'Elena Rostova',
    email: 'elena@fixora.care',
    phone: '+1 (555) 345-6789',
    role: 'provider',
    address: '15 Healthcare Way, Suite 200',
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    city: 'New York Metro',
    verificationStatus: 'approved',
  },
  {
    id: 'prv_102',
    name: 'Marcus Vance',
    email: 'marcus@fixora.care',
    phone: '+1 (555) 876-5432',
    role: 'provider',
    address: '77 Tech Drive, Apt 3',
    profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    city: 'New York Metro',
    verificationStatus: 'approved',
  },
  {
    id: 'admin_001',
    name: 'Platform Admin',
    email: 'admin@fixora.care',
    phone: '+1 (800) 555-ADMIN',
    role: 'admin',
    address: '1 Fixora Plaza, Executive Suite 10',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    city: 'New York Metro',
    verificationStatus: 'approved',
  }
];

const DEFAULT_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr_1',
    title: 'Home',
    name: 'Dhanush',
    phone: '+1 (555) 234-5678',
    street: '42 Maplewood Avenue',
    area: 'Suite 4B',
    city: 'New York Metro',
    zipCode: '10001',
    landmark: 'Near Central Park',
    isDefault: true,
  },
  {
    id: 'addr_2',
    title: "Parents' House (Elder Care)",
    name: 'Robert & Mary',
    phone: '+1 (555) 987-6543',
    street: '88 Oakridge Lane',
    area: 'Block C',
    city: 'New York Metro',
    zipCode: '10005',
    landmark: 'Opposite Community Center',
    isDefault: false,
  }
];

class DatabaseService {
  private inMemoryCache: Record<string, any> = {};

  private async getItem<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const jsonStr = await AsyncStorage.getItem(key);
      if (jsonStr !== null) {
        const parsed = JSON.parse(jsonStr);
        this.inMemoryCache[key] = parsed;
        return parsed;
      }
    } catch (err) {
      console.warn(`[DatabaseService] Error reading key ${key}, using cache/default:`, err);
    }
    
    if (this.inMemoryCache[key] !== undefined) {
      return this.inMemoryCache[key];
    }
    
    this.inMemoryCache[key] = defaultValue;
    return defaultValue;
  }

  private async setItem<T>(key: string, value: T): Promise<void> {
    this.inMemoryCache[key] = value;
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`[DatabaseService] Error persisting key ${key}:`, err);
    }
  }

  // --- INITIALIZATION ---
  public async initDatabase(): Promise<{
    users: User[];
    currentSessionUser: User | null;
    bookings: Booking[];
    addresses: SavedAddress[];
    providers: ServiceProvider[];
    services: ServiceItem[];
    complaints: Complaint[];
    messages: ChatMessage[];
  }> {
    let users = await this.getItem<User[]>(STORAGE_KEYS.USERS, []);
    if (!users || users.length === 0) {
      users = DEFAULT_USERS;
      await this.setItem(STORAGE_KEYS.USERS, users);
    }

    let addresses = await this.getItem<SavedAddress[]>(STORAGE_KEYS.ADDRESSES, []);
    if (!addresses || addresses.length === 0) {
      addresses = DEFAULT_ADDRESSES;
      await this.setItem(STORAGE_KEYS.ADDRESSES, addresses);
    }

    let providers = await this.getItem<ServiceProvider[]>(STORAGE_KEYS.PROVIDERS, []);
    if (!providers || providers.length === 0) {
      providers = MOCK_PROVIDERS;
      await this.setItem(STORAGE_KEYS.PROVIDERS, providers);
    }

    let services = await this.getItem<ServiceItem[]>(STORAGE_KEYS.SERVICES, []);
    if (!services || services.length === 0) {
      services = MOCK_SERVICES;
      await this.setItem(STORAGE_KEYS.SERVICES, services);
    }

    let bookings = await this.getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
    if (!bookings || bookings.length === 0) {
      bookings = INITIAL_BOOKINGS;
      await this.setItem(STORAGE_KEYS.BOOKINGS, bookings);
    }

    let complaints = await this.getItem<Complaint[]>(STORAGE_KEYS.COMPLAINTS, []);
    let messages = await this.getItem<ChatMessage[]>(STORAGE_KEYS.MESSAGES, []);

    let currentSessionUser = await this.getItem<User | null>(STORAGE_KEYS.CURRENT_USER, DEFAULT_USERS[0]);

    return {
      users,
      currentSessionUser,
      bookings,
      addresses,
      providers,
      services,
      complaints,
      messages,
    };
  }

  // --- USER AUTH & REGISTRATION ---
  public async getUsers(): Promise<User[]> {
    return await this.getItem<User[]>(STORAGE_KEYS.USERS, DEFAULT_USERS);
  }

  public async findUserByEmail(email: string, role?: UserRole): Promise<User | null> {
    const users = await this.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const match = users.find(u => 
      u.email.trim().toLowerCase() === cleanEmail && (!role || u.role === role)
    );
    return match || null;
  }

  public async updateUserPassword(email: string, newPassword: string): Promise<boolean> {
    const users = await this.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const index = users.findIndex(u => u.email.trim().toLowerCase() === cleanEmail);
    if (index !== -1) {
      users[index] = { ...users[index], password: newPassword };
      await this.setItem(STORAGE_KEYS.USERS, users);
      return true;
    }
    return false;
  }

  public async saveUsers(newUsers: User[]): Promise<void> {
    const existing = await this.getUsers();
    const map = new Map<string, User>();
    existing.forEach(u => map.set(u.email.toLowerCase(), u));
    newUsers.forEach(u => {
      const prev = map.get(u.email.toLowerCase());
      map.set(u.email.toLowerCase(), { ...prev, ...u, password: u.password || prev?.password });
    });
    const merged = Array.from(map.values());
    await this.setItem(STORAGE_KEYS.USERS, merged);
  }

  public async registerUser(userData: Partial<User>): Promise<User> {
    const users = await this.getUsers();
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: userData.name || 'Registered User',
      email: userData.email?.trim().toLowerCase() || `user_${Date.now()}@fixora.com`,
      password: userData.password || 'password123',
      phone: userData.phone || '+1 555-0000',
      role: userData.role || 'customer',
      address: userData.address || '123 Main Street',
      profileImage: userData.role === 'provider' 
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      city: userData.city || 'New York Metro',
      verificationStatus: userData.role === 'provider' ? 'pending' : 'not_submitted',
    };

    const updated = [newUser, ...users];
    await this.setItem(STORAGE_KEYS.USERS, updated);
    await this.setCurrentUser(newUser);

    // If provider, create matching ServiceProvider entry
    if (newUser.role === 'provider') {
      const providers = await this.getItem<ServiceProvider[]>(STORAGE_KEYS.PROVIDERS, MOCK_PROVIDERS);
      const newProviderRecord: ServiceProvider = {
        id: newUser.id,
        name: newUser.name,
        profileImage: newUser.profileImage,
        tagline: `${userData.city || 'Qualified'} Certified Service Professional`,
        categoryType: 'home',
        servicesOffered: ['srv_clean_1', 'srv_rep_1'],
        experienceYears: 3,
        qualifications: ['Safety Certified', 'Identity Verified'],
        certifications: ['Fixora Care Partner'],
        languages: ['English'],
        rating: 5.0,
        reviewsCount: 1,
        verified: false,
        availabilityStatus: 'Available Today',
        startingPrice: 35,
        serviceArea: newUser.address,
        bio: `Professional service provider specializing in home care and maintenance. Dedicated to safety and prompt service.`,
        reviews: [],
        earnings: { total: 0, withdrawable: 0, pending: 0 }
      };
      await this.setItem(STORAGE_KEYS.PROVIDERS, [newProviderRecord, ...providers]);
    }

    return newUser;
  }

  public async setCurrentUser(user: User | null): Promise<void> {
    await this.setItem(STORAGE_KEYS.CURRENT_USER, user);
  }

  public async getCurrentUser(): Promise<User | null> {
    return await this.getItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  }

  // --- BOOKING OPERATONS ---
  public async getBookings(): Promise<Booking[]> {
    return await this.getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  }

  public async saveBooking(booking: Booking): Promise<Booking[]> {
    const bookings = await this.getBookings();
    const updated = [booking, ...bookings.filter(b => b.id !== booking.id)];
    await this.setItem(STORAGE_KEYS.BOOKINGS, updated);
    return updated;
  }

  public async updateBookingStatus(bookingId: string, status: BookingStatus): Promise<Booking[]> {
    const bookings = await this.getBookings();
    const updated = bookings.map(b => b.id === bookingId ? { ...b, status } : b);
    await this.setItem(STORAGE_KEYS.BOOKINGS, updated);
    return updated;
  }

  // --- ADDRESS MANAGEMENT ---
  public async getAddresses(): Promise<SavedAddress[]> {
    return await this.getItem<SavedAddress[]>(STORAGE_KEYS.ADDRESSES, DEFAULT_ADDRESSES);
  }

  public async saveAddresses(addresses: SavedAddress[]): Promise<void> {
    await this.setItem(STORAGE_KEYS.ADDRESSES, addresses);
  }

  // --- PROVIDERS & REVIEWS ---
  public async getProviders(): Promise<ServiceProvider[]> {
    return await this.getItem<ServiceProvider[]>(STORAGE_KEYS.PROVIDERS, MOCK_PROVIDERS);
  }

  public async saveProviders(providers: ServiceProvider[]): Promise<void> {
    await this.setItem(STORAGE_KEYS.PROVIDERS, providers);
  }

  // --- COMPLAINTS & MESSAGES ---
  public async getComplaints(): Promise<Complaint[]> {
    return await this.getItem<Complaint[]>(STORAGE_KEYS.COMPLAINTS, []);
  }

  public async saveComplaints(complaints: Complaint[]): Promise<void> {
    await this.setItem(STORAGE_KEYS.COMPLAINTS, complaints);
  }

  public async getMessages(): Promise<ChatMessage[]> {
    return await this.getItem<ChatMessage[]>(STORAGE_KEYS.MESSAGES, []);
  }

  public async saveMessages(messages: ChatMessage[]): Promise<void> {
    await this.setItem(STORAGE_KEYS.MESSAGES, messages);
  }
}

export const databaseService = new DatabaseService();
