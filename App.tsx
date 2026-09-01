import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { AppProvider, useApp } from './src/context/AppContext';
import { Header } from './src/components/Header';
import { BottomNavigation } from './src/components/BottomNavigation';

import { SplashScreen } from './src/screens/SplashScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ServicesScreen } from './src/screens/ServicesScreen';
import { ElderCareScreen } from './src/screens/ElderCareScreen';
import { ChildCareScreen } from './src/screens/ChildCareScreen';
import { ProviderProfileScreen } from './src/screens/ProviderProfileScreen';
import { BookingFlowScreen } from './src/screens/BookingFlowScreen';
import { BookingDetailsScreen } from './src/screens/BookingDetailsScreen';
import { BookingsScreen } from './src/screens/BookingsScreen';
import { FavouritesScreen } from './src/screens/FavouritesScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { ProviderDashboardScreen } from './src/screens/ProviderDashboardScreen';
import { AdminDashboardScreen } from './src/screens/AdminDashboardScreen';
import { ChatScreen } from './src/screens/ChatScreen';
import { AddressManagerScreen } from './src/screens/AddressManagerScreen';
import { ComplaintsScreen } from './src/screens/ComplaintsScreen';
import { CouponsScreen } from './src/screens/CouponsScreen';
import { ProviderVerificationScreen } from './src/screens/ProviderVerificationScreen';

const MainNavigator: React.FC = () => {
  const { currentScreen, activeTab, role } = useApp();

  const renderTabScreen = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeScreen />;
      case 'Services':
        return <ServicesScreen />;
      case 'Bookings':
        return <BookingsScreen />;
      case 'Favourites':
        return <FavouritesScreen />;
      case 'Profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const renderContent = () => {
    switch (currentScreen) {
      case 'Splash':
        return <SplashScreen />;
      case 'Login':
        return <LoginScreen />;
      case 'Register':
        return <RegisterScreen />;
      case 'MainTab':
        return (
          <View style={styles.mainTabContainer}>
            <Header 
              title={activeTab === 'Home' ? 'Fixora Care' : activeTab} 
              showLocation={activeTab === 'Home'}
            />
            <View style={styles.tabBody}>{renderTabScreen()}</View>
          </View>
        );
      case 'ElderCare':
        return <ElderCareScreen />;
      case 'ChildCare':
        return <ChildCareScreen />;
      case 'CategoryDetail':
        return <ServicesScreen />;
      case 'ProviderProfile':
        return <ProviderProfileScreen />;
      case 'BookingFlow':
        return <BookingFlowScreen />;
      case 'BookingDetails':
        return <BookingDetailsScreen />;
      case 'Notifications':
        return <NotificationsScreen />;
      case 'ProviderDashboard':
        return <ProviderDashboardScreen />;
      case 'AdminDashboard':
        return <AdminDashboardScreen />;
      case 'Chat':
        return <ChatScreen />;
      case 'AddressManager':
        return <AddressManagerScreen />;
      case 'Complaints':
        return <ComplaintsScreen />;
      case 'Coupons':
        return <CouponsScreen />;
      case 'ProviderVerification':
        return <ProviderVerificationScreen />;
      default:
        return <SplashScreen />;
    }
  };

  const hideBottomNav = ['Splash', 'Login', 'Register', 'Chat', 'AdminDashboard', 'BookingFlow'].includes(currentScreen);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.body}>{renderContent()}</View>
      {!hideBottomNav && <BottomNavigation />}
    </SafeAreaView>
  );
};

export default function App(): React.JSX.Element {
  return (
    <AppProvider>
      <MainNavigator />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  body: {
    flex: 1,
  },
  mainTabContainer: {
    flex: 1,
  },
  tabBody: {
    flex: 1,
  },
});