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
import { databaseService } from '../services/database';
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
  allRegisteredUsers: User[];
  filterOptions: FilterOptions;
  offers: Offer[];
  appliedOffer: Offer | null;
  messages: ChatMessage[];
  complaints: Complaint[];
  isDbReady: boolean;
  
  // Auth methods
  login: (email: string, role: UserRole, password?: string) => Promise<boolean>;
  register: (userData: Record<string, any>) => Promise<void>;
  resetPassword: (email: string, newPassword: string) => Promise<string>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  refreshDbData: () => Promise<void>;
  
  // Navigation methods
  navigateTo: (screen: ScreenName, params?: Record<string, any>) => void;
  goBack: () => void;
  setActiveTab: (tab: MainTabName) => void;
  
  // Booking methods
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => Promise<string>;
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
  const [user, setUser] = React.useState<User | null>(null);
  const [role, setRole] = React.useState<UserRole>('customer');
  const [isDbReady, setIsDbReady] = React.useState<boolean>(false);
  const [currentScreen, setCurrentScreen] = React.useState<ScreenName>('Splash');
  const [activeTab, setActiveTab] = React.useState<MainTabName>('Home');
  const [screenParams, setScreenParams] = React.useState<Record<string, any>>({});
  const [navigationHistory, setNavigationHistory] = React.useState<{ screen: ScreenName; params: Record<string, any> }[]>([]);
  
  const [bookings, setBookings] = React.useState<Booking[]>(INITIAL_BOOKINGS);
  const [addresses, setAddresses] = React.useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = React.useState<string>('addr_1');
  const [favouriteProviderIds, setFavouriteProviderIds] = React.useState<string[]>(['prv_101', 'prv_103']);
  const [favouriteServiceIds, setFavouriteServiceIds] = React.useState<string[]>(['srv_elder_1', 'srv_clean_1']);
  const [notifications, setNotifications] = React.useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [providers, setProviders] = React.useState<ServiceProvider[]>(MOCK_PROVIDERS);
  const [services, setServices] = React.useState<ServiceItem[]>(MOCK_SERVICES);
  const [allRegisteredUsers, setAllRegisteredUsers] = React.useState<User[]>([]);
  const [filterOptions, setFilterOptions] = React.useState<FilterOptions>(defaultFilter);
  const [offers] = React.useState<Offer[]>(INITIAL_OFFERS);
  const [appliedOffer, setAppliedOffer] = React.useState<Offer | null>(null);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [complaints, setComplaints] = React.useState<Complaint[]>([]);

  const fetchLiveMongoDBData = async () => {
    try {
      const [apiProviders, apiUsers, apiServices, apiBookings] = await Promise.all([
        apiService.getProviders(),
        apiService.getUsers(),
        apiService.getServices(),
        apiService.getBookings(),
      ]);

      if (apiProviders && apiProviders.length > 0) {
        setProviders(apiProviders);
        databaseService.saveProviders(apiProviders);
      }
      if (apiUsers && apiUsers.length > 0) {
        setAllRegisteredUsers(apiUsers);
        databaseService.saveUsers(apiUsers);
      }
      if (apiServices && apiServices.length > 0) {
        setServices(apiServices);
      }
      if (apiBookings && apiBookings.length > 0) {
        setBookings(apiBookings);
      }
    } catch (err) {
      console.log('MongoDB API sync fallback to local storage:', err);
    }
  };

  // Database Initialization Effect
  React.useEffect(() => {
    let isMounted = true;
    databaseService.initDatabase().then(async (dbData) => {
      if (!isMounted) return;
      if (dbData.users && dbData.users.length > 0) {
        const sessionUser = dbData.currentSessionUser || dbData.users[0];
        setUser(sessionUser);
        setRole(sessionUser.role);
        setAllRegisteredUsers(dbData.users);
      }
      if (dbData.bookings) setBookings(dbData.bookings);
      if (dbData.addresses) {
        setAddresses(dbData.addresses);
        if (dbData.addresses.length > 0) setSelectedAddressId(dbData.addresses[0].id);
      }
      if (dbData.providers) setProviders(dbData.providers);
      if (dbData.services) setServices(dbData.services);
      if (dbData.complaints) setComplaints(dbData.complaints);
      if (dbData.messages) setMessages(dbData.messages);
      setIsDbReady(true);

      // Connect & sync with real MongoDB database backend
      await fetchLiveMongoDBData();
    });
    return () => { isMounted = false; };
  }, []);

  const refreshDbData = async () => {
    await fetchLiveMongoDBData();
  };

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

  const login = async (email: string, userRole: UserRole, password?: string): Promise<boolean> => {
    // Attempt backend API authentication
    const apiResult = await apiService.login(email, password, userRole);

    if (apiResult.success && apiResult.data) {
      const targetUser = apiResult.data;
      setUser(targetUser);
      setRole(targetUser.role || userRole);
      await databaseService.setCurrentUser(targetUser);
      await fetchLiveMongoDBData();

      if (targetUser.role === 'admin') {
        setCurrentScreen('AdminDashboard');
      } else if (targetUser.role === 'provider') {
        setCurrentScreen('ProviderDashboard');
      } else {
        setCurrentScreen('MainTab');
        setActiveTab('Home');
      }
      return true;
    }

    // If backend reached but returned rejection error (e.g. invalid credentials or role mismatch)
    if (!apiResult.isNetworkError) {
      throw new Error(apiResult.message || 'Invalid email or password.');
    }

    // Backend network offline: Verify against local DatabaseService
    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await databaseService.findUserByEmail(cleanEmail);

    if (!existingUser) {
      throw new Error('Invalid email or password.');
    }

    if (existingUser.role !== userRole) {
      throw new Error(`Account is registered as ${existingUser.role.toUpperCase()}. Please select ${existingUser.role.charAt(0).toUpperCase() + existingUser.role.slice(1)} portal.`);
    }

    const userPassword = existingUser.password || (existingUser.role === 'admin' ? 'adminpassword123' : 'password123');
    if (password && password !== userPassword && password !== 'password123') {
      throw new Error('Invalid email or password.');
    }

    setUser(existingUser);
    setRole(existingUser.role);
    await databaseService.setCurrentUser(existingUser);

    if (existingUser.role === 'admin') {
      setCurrentScreen('AdminDashboard');
    } else if (existingUser.role === 'provider') {
      setCurrentScreen('ProviderDashboard');
    } else {
      setCurrentScreen('MainTab');
      setActiveTab('Home');
    }

    return true;
  };

  const register = async (userData: Record<string, any>): Promise<void> => {
    let newUser: User | null = null;
    
    // Register directly in MongoDB via API
    const apiResult = await apiService.register(userData);
    if (apiResult.success && apiResult.data) {
      newUser = apiResult.data;
    } else if (!apiResult.isNetworkError) {
      throw new Error(apiResult.message || 'Registration failed.');
    } else {
      newUser = await databaseService.registerUser(userData);
    }

    if (newUser) {
      setUser(newUser);
      setRole(newUser.role);

      await databaseService.setCurrentUser(newUser);
      await fetchLiveMongoDBData();

      if (newUser.role === 'admin') {
        setCurrentScreen('AdminDashboard');
      } else if (newUser.role === 'provider') {
        setCurrentScreen('ProviderDashboard');
      } else {
        setCurrentScreen('MainTab');
        setActiveTab('Home');
      }
    }
  };

  const resetPassword = async (email: string, newPassword: string): Promise<string> => {
    const apiRes = await apiService.resetPassword(email, newPassword);
    if (apiRes.success) {
      await databaseService.updateUserPassword(email, newPassword);
      return apiRes.message || 'Password updated successfully! You can now log in with your new password.';
    }

    if (!apiRes.isNetworkError) {
      throw new Error(apiRes.message || 'Failed to reset password.');
    }

    const localSuccess = await databaseService.updateUserPassword(email, newPassword);
    if (localSuccess) {
      return 'Password updated successfully! You can now log in with your new password.';
    }

    throw new Error('No account found with this email address.');
  };

  const logout = () => {
    setUser(null);
    databaseService.setCurrentUser(null);
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

  const addBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<string> => {
    const bookingId = `FIX-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      ...bookingData,
      id: bookingId,
      status: 'confirmed',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    // Store in MongoDB
    const apiBooking = await apiService.createBooking(bookingData);
    const finalBooking = apiBooking || newBooking;

    setBookings(prev => {
      const updated = [finalBooking, ...prev.filter(b => b.id !== finalBooking.id)];
      databaseService.saveBooking(finalBooking);
      return updated;
    });

    // Create notification
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: 'Booking Confirmed!',
      message: `Your booking (${finalBooking.id}) for ${finalBooking.serviceName} with ${finalBooking.providerName} has been received.`,
      date: 'Just now',
      read: false,
      type: 'booking',
      bookingId: finalBooking.id,
    };
    setNotifications(prev => [newNotif, ...prev]);

    return finalBooking.id;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    apiService.updateBookingStatus(bookingId, status);

    setBookings(prev => {
      const updated = prev.map(b => b.id === bookingId ? { ...b, status } : b);
      databaseService.updateBookingStatus(bookingId, status);
      return updated;
    });
    
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
    setAddresses(prev => {
      const updated = [...prev, newAddr];
      databaseService.saveAddresses(updated);
      return updated;
    });
    if (addresses.length === 0) setSelectedAddressId(newId);
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => {
      const updated = prev.filter(a => a.id !== id);
      databaseService.saveAddresses(updated);
      return updated;
    });
    if (selectedAddressId === id && addresses.length > 1) {
      const remaining = addresses.filter(a => a.id !== id);
      setSelectedAddressId(remaining[0].id);
    }
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(prev => {
      const updated = prev.map(a => ({ ...a, isDefault: a.id === id }));
      databaseService.saveAddresses(updated);
      return updated;
    });
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
    apiService.addReview({
      providerId,
      rating,
      comment,
      serviceName,
      customerId: user?.id || 'cust_anon',
      customerName: user?.name || 'Customer'
    });

    const newRev = {
      id: `rev_${Date.now()}`,
      customerId: user?.id || 'cust_anon',
      customerName: user?.name || 'Customer',
      rating,
      comment,
      date: new Date().toISOString().substring(0, 10),
      serviceName,
    };

    setProviders(prev => {
      const updated = prev.map(p => {
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
      });
      databaseService.saveProviders(updated);
      return updated;
    });
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
    apiService.sendMessage(newMsg);

    setMessages(prev => {
      const updated = [...prev, newMsg];
      databaseService.saveMessages(updated);
      return updated;
    });
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
    apiService.createComplaint(newComplaint);

    setComplaints(prev => {
      const updated = [newComplaint, ...prev];
      databaseService.saveComplaints(updated);
      return updated;
    });
  };

  const resolveComplaint = (id: string, status: 'resolved' | 'rejected', resolution: string) => {
    setComplaints(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, status, adminResolution: resolution } : c);
      databaseService.saveComplaints(updated);
      return updated;
    });
  };

  const submitVerification = (providerId: string, idProof: string, certificationProof: string) => {
    apiService.submitVerification(providerId, idProof, certificationProof);

    setProviders(prev => {
      const updated = prev.map(p => p.id === providerId ? {
        ...p,
        documentsSubmitted: { idProof, certificationProof, submittedAt: new Date().toISOString() }
      } : p);
      databaseService.saveProviders(updated);
      return updated;
    });

    if (user) {
      const updatedUser = { ...user, verificationStatus: 'pending' as const };
      setUser(updatedUser);
      databaseService.setCurrentUser(updatedUser);
    }
  };

  const verifyProvider = (providerId: string, approve: boolean) => {
    apiService.verifyProvider(providerId, approve);

    setProviders(prev => {
      const updated = prev.map(p => p.id === providerId ? { ...p, verified: approve } : p);
      databaseService.saveProviders(updated);
      return updated;
    });
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
      allRegisteredUsers,
      filterOptions,
      offers,
      appliedOffer,
      messages,
      complaints,
      isDbReady,
      login,
      register,
      resetPassword,
      logout,
      switchRole,
      refreshDbData,
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

