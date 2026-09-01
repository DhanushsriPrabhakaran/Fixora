import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { useApp } from '../context/AppContext';
import { BookingCard } from '../components/BookingCard';

export const BookingsScreen: React.FC = () => {
  const { bookings, navigateTo } = useApp();
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'ongoing' | 'completed'>('upcoming');

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'provider_assigned');
  const ongoingBookings = bookings.filter(b => b.status === 'on_the_way' || b.status === 'in_progress');
  const completedBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  const getActiveList = () => {
    switch (selectedTab) {
      case 'upcoming': return upcomingBookings;
      case 'ongoing': return ongoingBookings;
      case 'completed': return completedBookings;
      default: return [];
    }
  };

  const currentList = getActiveList();

  return (
    <View style={styles.container}>
      {/* Header Tabs */}
      <View style={styles.tabHeader}>
        <Text style={styles.headerTitle}>My Bookings</Text>

        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, selectedTab === 'upcoming' && styles.activeTabBtn]}
            onPress={() => setSelectedTab('upcoming')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, selectedTab === 'upcoming' && styles.activeTabText]}>
              Upcoming ({upcomingBookings.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, selectedTab === 'ongoing' && styles.activeTabBtn]}
            onPress={() => setSelectedTab('ongoing')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, selectedTab === 'ongoing' && styles.activeTabText]}>
              Ongoing ({ongoingBookings.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, selectedTab === 'completed' && styles.activeTabBtn]}
            onPress={() => setSelectedTab('completed')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, selectedTab === 'completed' && styles.activeTabText]}>
              History ({completedBookings.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bookings List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {currentList.length > 0 ? (
          currentList.map(b => (
            <BookingCard 
              key={b.id} 
              booking={b} 
              onRate={() => navigateTo('BookingDetails', { bookingId: b.id })}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>No {selectedTab} bookings</Text>
            <Text style={styles.emptySub}>
              You don't have any {selectedTab} bookings right now. Explore services to book a provider!
            </Text>
            <TouchableOpacity 
              style={styles.bookFirstBtn}
              onPress={() => navigateTo('Services')}
              activeOpacity={0.85}
            >
              <Text style={styles.bookFirstText}>Browse Services →</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  tabHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 14,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    padding: 3,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabBtn: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  activeTabText: {
    color: '#1E40AF',
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  emptySub: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 260,
    marginBottom: 16,
    lineHeight: 18,
  },
  bookFirstBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bookFirstText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
