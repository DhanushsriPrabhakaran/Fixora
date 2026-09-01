import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp, MainTabName } from '../context/AppContext';

interface TabItem {
  id: MainTabName;
  label: string;
  icon: string;
  badge?: number;
}

export const BottomNavigation: React.FC = () => {
  const { activeTab, setActiveTab, currentScreen, navigateTo, bookings } = useApp();

  const activeBookingsCount = bookings.filter(
    b => b.status === 'confirmed' || b.status === 'provider_assigned' || b.status === 'on_the_way' || b.status === 'in_progress'
  ).length;

  const tabs: TabItem[] = [
    { id: 'Home', label: 'Home', icon: '🏠' },
    { id: 'Services', label: 'Services', icon: '🔍' },
    { id: 'Bookings', label: 'Bookings', icon: '📅', badge: activeBookingsCount },
    { id: 'Favourites', label: 'Saved', icon: '❤️' },
    { id: 'Profile', label: 'Profile', icon: '👤' },
  ];

  if (currentScreen !== 'MainTab') {
    return null;
  }

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabBtn}
            onPress={() => setActiveTab(tab.id)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Text style={[styles.tabIcon, isActive && styles.activeTabIcon]}>
                {tab.icon}
              </Text>
              {tab.badge && tab.badge > 0 ? (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{tab.badge}</Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.tabLabel, isActive ? styles.activeLabel : styles.inactiveLabel]}>
              {tab.label}
            </Text>
            {isActive ? <View style={styles.activeDot} /> : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    paddingBottom: 4,
  },
  tabBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
    opacity: 0.6,
  },
  activeTabIcon: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  activeLabel: {
    color: '#2563EB',
    fontWeight: '700',
  },
  inactiveLabel: {
    color: '#6B7280',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2563EB',
    marginTop: 2,
  },
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
});
