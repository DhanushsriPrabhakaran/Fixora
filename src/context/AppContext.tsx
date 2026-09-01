import React, { createContext, useContext, useState } from 'react';
import { 
  User, 
  UserRole, 
  Booking, 
  AppNotification, 
  FilterOptions, 
  ServiceProvider, 
  ServiceItem,
  BookingStatus,
  SavedAddress,
  ChatMessage,
  Complaint,
  Offer
} from '../types';
import { MOCK_PROVIDERS, MOCK_SERVICES, INITIAL_BOOKINGS, INITIAL_NOTIFICATIONS } from '../data/mockData';
import { apiService } from '../services/api';

export type ScreenName = 
  | 'Splash'
  | 'Login'
  | 'Register'
  | 'MainTab'
  | 'Home'
  | 'Services'
  | 'Bookings'
  | 'Favourites'
  | 'Profile'
  | 'ElderCare'
  | 'ChildCare'
  | 'CategoryDetail'
  | 'ProviderProfile'
  | 'BookingFlow'
  | 'BookingDetails'
  | 'Notifications'
  | 'ProviderDashboard'
  | 'AdminDashboard'
  | 'Chat'
  | 'AddressManager'
  | 'Complaints'
  | 'Coupons'
  | 'ProviderVerification';

export type MainTabName = 'Home' | 'Services' | 'Bookings' | 'Favourites' | 'Profile';

const INITIAL_ADDRESSES: SavedAddress[] = [
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
    title: 'Parents House (Elder Care)',
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

const INITIAL_OFFERS: Offer[] = [
  {
    code: 'FIXORA10',
    title: '10% Instant Discount',
    description: 'Save 10% on home maintenance, deep cleaning, or care services.',
    discountPercentage: 10,
    maxDiscount: 25,
    minBookingAmount: 30,
    validUntil: '2026-12-31',
  },
  {
    code: 'ELDERCARE15',
    title: '15% Senior Companion Care Discount',
    description: 'Save 15% on elderly care & companion booking packages.',
    discountPercentage: 15,
    maxDiscount: 50,
    minBookingAmount: 50,
    validUntil: '2026-12-31',
  },
  {
    code: 'FIRST50',
    title: '$20 OFF Welcome Discount',
    description: 'Flat $20 discount for first-time service bookings.',
    discountPercentage: 20,
    maxDiscount: 20,
    minBookingAmount: 40,
    validUntil: '2026-12-31',
  }
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    bookingId: 'FIX-1002',
    senderId: 'prv_101',
    senderName: 'Elena Rostova',
    senderRole: 'provider',
    text: 'Hello! I will arrive at your address around 2:00 PM.',
    createdAt: '10:15 AM'
  },
  {
    id: 'msg_2',
    bookingId: 'FIX-1002',
    senderId: 'cust_101',
    senderName: 'Dhanush',
    senderRole: 'customer',
    text: 'Great, thank you Elena! I have left the key at the front desk.',
    createdAt: '10:18 AM'
  }
];

const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'cmp_101',
    bookingId: 'FIX-1001',
    userId: 'cust_101',
    userName: 'Dhanush',
    userRole: 'customer',
    category: 'Service Quality',
    subject: 'Minor delay in arrival time',
    description: 'The provider arrived 25 minutes after the scheduled slot without prior update.',
    status: 'resolved',
    adminResolution: 'Provider warned and $10 credit issued to customer wallet.',
    createdAt: '2026-08-25'
  }
];

interface AppContextType {
  user: User | null;
  role: UserRole;
  currentScreen: ScreenName;
  activeTab: MainTabName;
  screenParams: Record<string, any>;
  bookings: Booking[];
  addresses: SavedAddress[];
  selectedAddressId: string;
  favouriteProviderIds: string[];
  favouriteServiceIds: string[];
  notifications: AppNotification[];
  providers: ServiceProvider[];
  services: ServiceItem[];
  filterOptions: FilterOptions;
  offers: Offer[];
  appliedOffer: Offer | null;
  messages: ChatMessage[];
  complaints: Complaint[];
  
  // Auth methods
  login: (email: string, role: UserRole) => void;
  register: (userData: Partial<User>) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  
  // Navigation methods
  navigateTo: (screen: ScreenName, params?: Record<string, any>) => void;
  goBack: () => void;
  setActiveTab: (tab: MainTabName) => void;
  
  // Booking methods
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => string;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  cancelBooking: (bookingId: string) => void;
  
  // Address management
  addAddress: (address: Omit<SavedAddress, 'id' | 'isDefault'>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  setSelectedAddressId: (id: string) => void;

  // Favourites
  toggleFavouriteProvider: (providerId: string) => void;
  toggleFavouriteService: (serviceId: string) => void;
  
  // Notifications
  markNotificationRead: (id: string) => void;
  
  // Reviews
  addReview: (providerId: string, rating: number, comment: string, serviceName: string) => void;
  
  // Offers & Coupons
  applyOffer: (code: string, amount: number) => { success: boolean; message: string; discountAmount: number };
  clearOffer: () => void;

  // Chat
  sendMessage: (bookingId: string, text: string) => void;
  getBookingMessages: (bookingId: string) => ChatMessage[];

  // Complaints
  addComplaint: (bookingId: string, category: string, subject: string, description: string) => void;
  resolveComplaint: (id: string, status: 'resolved' | 'rejected', resolution: string) => void;

  // KYC Verification
  submitVerification: (providerId: string, idProof: string, certificationProof: string) => void;
  verifyProvider: (providerId: string, approve: boolean) => void;

  // Filters
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
}

const defaultFilter: FilterOptions = {
  searchQuery: '',
  minRating: 0,
  maxPrice: 5000,
  verifiedOnly: false,
  availabilityOnly: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: 'cust_101',
    name: 'Dhanush',
    email: 'dhanush@example.com',
    phone: '+1 (555) 234-5678',
    role: 'customer',
    address: '42 Maplewood Avenue, Suite 4B',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    city: 'New York Metro',
    verificationStatus: 'not_submitted',
  });
  
  const [role, setRole] = useState<UserRole>('customer');
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('Splash');
  const [activeTab, setActiveTab] = useState<MainTabName>('Home');
  const [screenParams, setScreenParams] = useState<Record<string, any>>({});
  const [navigationHistory, setNavigationHistory] = useState<{ screen: ScreenName; params: Record<string, any> }[]>([]);
  
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [addresses, setAddresses] = useState<SavedAddress[]>(INITIAL_ADDRESSES);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('addr_1');
  const [favouriteProviderIds, setFavouriteProviderIds] = useState<string[]>(['prv_101', 'prv_103']);
  const [favouriteServiceIds, setFavouriteServiceIds] = useState<string[]>(['srv_elder_1', 'srv_clean_1']);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [providers, setProviders] = useState<ServiceProvider[]>(MOCK_PROVIDERS);
  const [services] = useState<ServiceItem[]>(MOCK_SERVICES);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(defaultFilter);
  const [offers] = useState<Offer[]>(INITIAL_OFFERS);
  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);

  const navigateTo = (screen: ScreenName, params: Record<string, any> = {}) => {
    setNavigationHistory(prev => [...prev, { screen: currentScreen, params: screenParams }]);

    if (screen === 'Home' || screen === 'Services' || screen === 'Bookings' || screen === 'Favourites' || screen === 'Profile') {
      setActiveTab(screen);
      setCurrentScreen('MainTab');
      setScreenParams(params);
    } else {
      setCurrentScreen(screen);
      setScreenParams(params);
    }
  };

  const goBack = () => {
    if (navigationHistory.length > 0) {
      const last = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, -1));
      setCurrentScreen(last.screen);
      setScreenParams(last.params);
    } else {
      setCurrentScreen('MainTab');
      setActiveTab('Home');
    }
  };

  const login = (email: string, userRole: UserRole) => {
    const isProvider = userRole === 'provider';
    const isAdmin = userRole === 'admin';

    const newUser: User = {
      id: isAdmin ? 'admin_001' : (isProvider ? 'prv_101' : 'cust_101'),
      name: isAdmin ? 'Platform Admin' : (isProvider ? 'Elena Rostova' : 'Dhanush'),
      email: email || (isAdmin ? 'admin@fixora.care' : (isProvider ? 'elena@fixora.care' : 'dhanush@example.com')),
      phone: '+1 (555) 234-5678',
      role: userRole,
      address: '42 Maplewood Avenue, Suite 4B',
      profileImage: isAdmin 
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80'
        : (isProvider 
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'),
      verificationStatus: isProvider ? 'approved' : 'not_submitted'
    };

    setUser(newUser);
    setRole(userRole);

    if (isAdmin) {
      setCurrentScreen('AdminDashboard');
    } else if (isProvider) {
      setCurrentScreen('ProviderDashboard');
    } else {
      setCurrentScreen('MainTab');
      setActiveTab('Home');
    }
  };

  const register = (userData: Partial<User>) => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: userData.name || 'New User',
      email: userData.email || 'user@fixora.com',
      phone: userData.phone || '+1 555-0000',
      role: userData.role || 'customer',
      address: userData.address || '123 Main Street',
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      verificationStatus: userData.role === 'provider' ? 'pending' : 'not_submitted'
    };

    setUser(newUser);
    setRole(newUser.role);

    if (newUser.role === 'admin') {
      setCurrentScreen('AdminDashboard');
    } else if (newUser.role === 'provider') {
      setCurrentScreen('ProviderDashboard');
    } else {
      setCurrentScreen('MainTab');
      setActiveTab('Home');
    }
  };

  const logout = () => {
    setUser(null);
    setCurrentScreen('Login');
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    if (user) {
      setUser({ ...user, role: newRole });
    }
    if (newRole === 'admin') {
      setCurrentScreen('AdminDashboard');
    } else if (newRole === 'provider') {
      setCurrentScreen('ProviderDashboard');
    } else {
      setCurrentScreen('MainTab');
      setActiveTab('Home');
    }
  };

  const addBooking = (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>): string => {
    const bookingId = `FIX-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      ...bookingData,
      id: bookingId,
      status: 'confirmed',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setBookings(prev => [newBooking, ...prev]);

    // Send async call to backend REST API
    apiService.createBooking({ ...bookingData, bookingId });

    // Create system notification
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: 'Booking Confirmed!',
      message: `Your booking (${bookingId}) for ${bookingData.serviceName} with ${bookingData.providerName} has been received.`,
      date: 'Just now',
      read: false,
      type: 'booking',
      bookingId: bookingId,
    };
    setNotifications(prev => [newNotif, ...prev]);

    return bookingId;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
    apiService.updateBookingStatus(bookingId, status);
    
    const targetBooking = bookings.find(b => b.id === bookingId);
    if (targetBooking) {
      let title = 'Booking Updated';
      let message = `Booking ${bookingId} status is now ${status.replace('_', ' ')}.`;
      if (status === 'on_the_way') {
        title = 'Provider On The Way!';
        message = `${targetBooking.providerName} is heading to ${targetBooking.address}.`;
      } else if (status === 'in_progress') {
        title = 'Service Started';
        message = `${targetBooking.providerName} has started ${targetBooking.serviceName}.`;
      } else if (status === 'completed') {
        title = 'Service Completed 🎉';
        message = `Service for ${targetBooking.serviceName} is complete. Please leave a rating!`;
      }
      
      setNotifications(prev => [{
        id: `notif_${Date.now()}`,
        title,
        message,
        date: 'Just now',
        read: false,
        type: status === 'completed' ? 'review' : 'booking',
        bookingId,
      }, ...prev]);
    }
  };

  const cancelBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'cancelled');
  };

  // Address Management
  const addAddress = (addrData: Omit<SavedAddress, 'id' | 'isDefault'>) => {
    const newId = `addr_${Date.now()}`;
    const newAddr: SavedAddress = {
      ...addrData,
      id: newId,
      isDefault: addresses.length === 0,
    };
    setAddresses(prev => [...prev, newAddr]);
    if (addresses.length === 0) setSelectedAddressId(newId);
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    if (selectedAddressId === id && addresses.length > 1) {
      const remaining = addresses.filter(a => a.id !== id);
      setSelectedAddressId(remaining[0].id);
    }
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    setSelectedAddressId(id);
  };

  const toggleFavouriteProvider = (providerId: string) => {
    setFavouriteProviderIds(prev => 
      prev.includes(providerId) ? prev.filter(id => id !== providerId) : [...prev, providerId]
    );
  };

  const toggleFavouriteService = (serviceId: string) => {
    setFavouriteServiceIds(prev => 
      prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId]
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const addReview = (providerId: string, rating: number, comment: string, serviceName: string) => {
    const newRev = {
      id: `rev_${Date.now()}`,
      customerId: user?.id || 'cust_anon',
      customerName: user?.name || 'Customer',
      rating,
      comment,
      date: new Date().toISOString().substring(0, 10),
      serviceName,
    };

    setProviders(prev => prev.map(p => {
      if (p.id === providerId) {
        const updatedReviews = [newRev, ...p.reviews];
        const avgRating = Number((updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length).toFixed(1));
        return {
          ...p,
          reviews: updatedReviews,
          reviewsCount: updatedReviews.length,
          rating: avgRating,
        };
      }
      return p;
    }));
  };

  const applyOffer = (code: string, amount: number) => {
    const target = offers.find(o => o.code.toUpperCase() === code.trim().toUpperCase());
    if (!target) {
      return { success: false, message: 'Invalid or expired coupon code', discountAmount: 0 };
    }
    if (amount < target.minBookingAmount) {
      return { success: false, message: `Minimum booking amount of $${target.minBookingAmount} required.`, discountAmount: 0 };
    }

    const discountAmount = Math.min((amount * target.discountPercentage) / 100, target.maxDiscount);
    setAppliedOffer(target);
    return { success: true, message: `Coupon '${target.code}' applied successfully!`, discountAmount };
  };

  const clearOffer = () => {
    setAppliedOffer(null);
  };

  const sendMessage = (bookingId: string, text: string) => {
    if (!text.trim()) return;
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      bookingId,
      senderId: user?.id || 'anon',
      senderName: user?.name || 'User',
      senderRole: role,
      text: text.trim(),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
    apiService.sendMessage(newMsg);
  };

  const getBookingMessages = (bookingId: string) => {
    return messages.filter(m => m.bookingId === bookingId);
  };

  const addComplaint = (bookingId: string, category: string, subject: string, description: string) => {
    const complaintId = `CMP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newComplaint: Complaint = {
      id: complaintId,
      bookingId,
      userId: user?.id || 'cust_101',
      userName: user?.name || 'Customer',
      userRole: role,
      category,
      subject,
      description,
      status: 'open',
      createdAt: new Date().toISOString().substring(0, 10)
    };
    setComplaints(prev => [newComplaint, ...prev]);
    apiService.createComplaint(newComplaint);
  };

  const resolveComplaint = (id: string, status: 'resolved' | 'rejected', resolution: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status, adminResolution: resolution } : c));
  };

  const submitVerification = (providerId: string, idProof: string, certificationProof: string) => {
    setProviders(prev => prev.map(p => p.id === providerId ? {
      ...p,
      documentsSubmitted: { idProof, certificationProof, submittedAt: new Date().toISOString() }
    } : p));

    if (user) {
      setUser({ ...user, verificationStatus: 'pending' });
    }
  };

  const verifyProvider = (providerId: string, approve: boolean) => {
    setProviders(prev => prev.map(p => p.id === providerId ? { ...p, verified: approve } : p));
    apiService.verifyProvider(providerId, approve);
  };

  return (
    <AppContext.Provider value={{
      user,
      role,
      currentScreen,
      activeTab,
      screenParams,
      bookings,
      addresses,
      selectedAddressId,
      favouriteProviderIds,
      favouriteServiceIds,
      notifications,
      providers,
      services,
      filterOptions,
      offers,
      appliedOffer,
      messages,
      complaints,
      login,
      register,
      logout,
      switchRole,
      navigateTo,
      goBack,
      setActiveTab,
      addBooking,
      updateBookingStatus,
      cancelBooking,
      addAddress,
      deleteAddress,
      setDefaultAddress,
      setSelectedAddressId,
      toggleFavouriteProvider,
      toggleFavouriteService,
      markNotificationRead,
      addReview,
      applyOffer,
      clearOffer,
      sendMessage,
      getBookingMessages,
      addComplaint,
      resolveComplaint,
      submitVerification,
      verifyProvider,
      setFilterOptions,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
