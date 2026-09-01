import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Switch 
} from 'react-native';
import { useApp } from '../context/AppContext';
import { BookingCard } from '../components/BookingCard';

export const ProviderDashboardScreen: React.FC = () => {
  const { user, bookings, switchRole, updateBookingStatus } = useApp();
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  const providerBookings = bookings; // In real app filter by providerId
  const activeJobs = providerBookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled');
  const completedJobs = providerBookings.filter(b => b.status === 'completed');

  const totalEarnings = completedJobs.reduce((acc, b) => acc + b.totalAmount, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Provider Header Dashboard */}
      <View style={styles.dashboardHeader}>
        <View style={styles.providerRow}>
          <Image 
            source={{ uri: user?.profileImage || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' }} 
            style={styles.avatar} 
          />
          <View style={styles.headerInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.providerName}>{user?.name || 'Elena Rostova'}</Text>
              <View style={styles.vBadge}>
                <Text style={styles.vCheck}>✓ Verified</Text>
              </View>
            </View>
            <Text style={styles.roleSub}>Certified Senior Caregiver & Specialist</Text>
            <Text style={styles.ratingText}>⭐ 4.95 (142 family reviews)</Text>
          </View>
        </View>

        {/* Availability Toggle */}
        <View style={styles.availToggleBox}>
          <View style={styles.availCol}>
            <Text style={styles.availTitle}>
              Status: {isAvailable ? '🟢 Accepting New Bookings' : '🔴 Currently Busy'}
            </Text>
            <Text style={styles.availSub}>Toggle to update your real-time availability on Fixora</Text>
          </View>
          <Switch
            value={isAvailable}
            onValueChange={setIsAvailable}
            trackColor={{ false: '#D1D5DB', true: '#6EE7B7' }}
            thumbColor={isAvailable ? '#059669' : '#9CA3AF'}
          />
        </View>

        {/* Quick Earnings & Job Metrics */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricVal}>₹{(totalEarnings + 19920).toLocaleString('en-IN')}</Text>
            <Text style={styles.metricLabel}>Total Earnings</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricVal}>{activeJobs.length}</Text>
            <Text style={styles.metricLabel}>Active Jobs</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricVal}>{completedJobs.length + 18}</Text>
            <Text style={styles.metricLabel}>Completed</Text>
          </View>
        </View>
      </View>

      {/* Switch to Customer Mode Button */}
      <TouchableOpacity 
        style={styles.switchModeBtn}
        onPress={() => switchRole('customer')}
        activeOpacity={0.8}
      >
        <Text style={styles.switchModeText}>🔄 Switch to Customer View</Text>
      </TouchableOpacity>

      {/* Incoming / Active Jobs Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active & Incoming Jobs ({activeJobs.length})</Text>
        <Text style={styles.sectionSub}>Update status as you travel to & start services</Text>

        {activeJobs.length > 0 ? (
          activeJobs.map(job => (
            <View key={job.id} style={styles.jobWrapper}>
              <BookingCard booking={job} />
              
              {/* Quick Status Action Bar for Provider */}
              <View style={styles.providerActionBar}>
                <Text style={styles.actionPrompt}>Job Progress Action:</Text>
                <View style={styles.actionBtns}>
                  <TouchableOpacity
                    style={styles.statusActionBtn}
                    onPress={() => updateBookingStatus(job.id, 'on_the_way')}
                  >
                    <Text style={styles.statusActionText}>🚗 On The Way</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.statusActionBtn}
                    onPress={() => updateBookingStatus(job.id, 'in_progress')}
                  >
                    <Text style={styles.statusActionText}>⚡ Start Job</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.statusActionBtnDone}
                    onPress={() => updateBookingStatus(job.id, 'completed')}
                  >
                    <Text style={styles.statusActionTextDone}>✅ Complete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No active job requests at the moment.</Text>
          </View>
        )}
      </View>

      {/* Completed Jobs History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Completed Jobs</Text>
        {completedJobs.map(job => (
          <BookingCard key={job.id} booking={job} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  dashboardHeader: {
    backgroundColor: '#065F46',
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 14,
    borderWidth: 2,
    borderColor: '#6EE7B7',
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  providerName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  vBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  vCheck: {
    color: '#065F46',
    fontSize: 10,
    fontWeight: 'bold',
  },
  roleSub: {
    fontSize: 12,
    color: '#A7F3D0',
    marginVertical: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FEF3C7',
  },
  availToggleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  availCol: {
    flex: 1,
    marginRight: 10,
  },
  availTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  availSub: {
    fontSize: 11,
    color: '#D1FAE5',
    marginTop: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#065F46',
  },
  metricLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 2,
  },
  switchModeBtn: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginBottom: 6,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  switchModeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E40AF',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  sectionSub: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  jobWrapper: {
    marginBottom: 14,
  },
  providerActionBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 10,
    marginTop: -8,
  },
  actionPrompt: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 6,
  },
  actionBtns: {
    flexDirection: 'row',
    gap: 6,
  },
  statusActionBtn: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  statusActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  statusActionBtnDone: {
    flex: 1,
    backgroundColor: '#D1FAE5',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  statusActionTextDone: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
  },
  emptyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 13,
  },
});
