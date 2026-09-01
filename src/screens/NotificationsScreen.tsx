import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';

export const NotificationsScreen: React.FC = () => {
  const { notifications, markNotificationRead, navigateTo } = useApp();

  const handleNotificationPress = (notifId: string, bookingId?: string) => {
    markNotificationRead(notifId);
    if (bookingId) {
      navigateTo('BookingDetails', { bookingId });
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Notifications" showBack={true} showNotification={false} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {notifications.length > 0 ? (
          notifications.map(n => (
            <TouchableOpacity
              key={n.id}
              style={[styles.notifCard, !n.read && styles.unreadCard]}
              onPress={() => handleNotificationPress(n.id, n.bookingId)}
              activeOpacity={0.8}
            >
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>
                  {n.type === 'booking' ? '📅' : n.type === 'review' ? '⭐' : '🔔'}
                </Text>
              </View>

              <View style={styles.contentCol}>
                <View style={styles.headerRow}>
                  <Text style={styles.title} numberOfLines={1}>{n.title}</Text>
                  <Text style={styles.date}>{n.date}</Text>
                </View>
                <Text style={styles.message}>{n.message}</Text>
              </View>

              {!n.read ? <View style={styles.unreadDot} /> : null}
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySub}>You're all caught up! Updates regarding your bookings will appear here.</Text>
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
  scrollContent: {
    padding: 16,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    marginBottom: 10,
  },
  unreadCard: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    elevation: 1,
  },
  iconText: {
    fontSize: 18,
  },
  contentCol: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    flex: 1,
  },
  date: {
    fontSize: 10,
    color: '#9CA3AF',
    marginLeft: 6,
  },
  message: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 16,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    marginLeft: 8,
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
  },
  emptySub: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 260,
  },
});
