import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Alert 
} from 'react-native';
import { useApp } from '../context/AppContext';

export const ProfileScreen: React.FC = () => {
  const { user, role, switchRole, logout, navigateTo, setActiveTab } = useApp();

  const handleRoleToggle = () => {
    const nextRole = role === 'customer' ? 'provider' : 'customer';
    switchRole(nextRole);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Profile Card Header */}
      <View style={styles.profileCard}>
        <Image 
          source={{ uri: user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' }} 
          style={styles.avatar} 
        />
        <Text style={styles.userName}>{user?.name || 'Fixora User'}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        <Text style={styles.userPhone}>{user?.phone}</Text>

        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>
            {role === 'admin' ? '🛡️ Admin Account' : (role === 'customer' ? '👨‍👩‍👧 Customer Account' : '🛠️ Service Provider Account')}
          </Text>
        </View>
      </View>

      {/* Role Switcher Banner */}
      <TouchableOpacity 
        style={styles.switchRoleCard} 
        onPress={handleRoleToggle}
        activeOpacity={0.85}
      >
        <View style={styles.switchCol}>
          <Text style={styles.switchTitle}>
            Switch to {role === 'customer' ? 'Provider Mode 🛠️' : 'Customer Mode 🏠'}
          </Text>
          <Text style={styles.switchSub}>
            {role === 'customer' 
              ? 'View incoming booking requests & manage jobs' 
              : 'Book home services & care for family'}
          </Text>
        </View>
        <Text style={styles.switchArrow}>›</Text>
      </TouchableOpacity>

      {/* Admin Switcher */}
      <TouchableOpacity 
        style={styles.adminRoleCard} 
        onPress={() => switchRole('admin')}
        activeOpacity={0.85}
      >
        <View style={styles.switchCol}>
          <Text style={styles.adminTitle}>Access Admin Control Panel 🛡️</Text>
          <Text style={styles.adminSub}>Platform Analytics, KYC approvals & Dispute resolution</Text>
        </View>
        <Text style={styles.switchArrow}>›</Text>
      </TouchableOpacity>

      {/* Navigation Options Menu */}
      <View style={styles.menuBox}>
        <Text style={styles.menuHeader}>Account & Services</Text>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigateTo('AddressManager')}
        >
          <Text style={styles.menuIcon}>📍</Text>
          <Text style={styles.menuLabel}>Saved Addresses</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigateTo('Coupons')}
        >
          <Text style={styles.menuIcon}>🏷️</Text>
          <Text style={styles.menuLabel}>Offers & Discount Coupons</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigateTo('Complaints')}
        >
          <Text style={styles.menuIcon}>🎧</Text>
          <Text style={styles.menuLabel}>Dispute Tickets & Complaints</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigateTo('ProviderVerification')}
        >
          <Text style={styles.menuIcon}>🪪</Text>
          <Text style={styles.menuLabel}>Provider KYC & Verification</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => setActiveTab('Bookings')}
        >
          <Text style={styles.menuIcon}>📅</Text>
          <Text style={styles.menuLabel}>My Bookings</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => setActiveTab('Favourites')}
        >
          <Text style={styles.menuIcon}>❤️</Text>
          <Text style={styles.menuLabel}>Saved Favourites</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigateTo('Notifications')}
        >
          <Text style={styles.menuIcon}>🔔</Text>
          <Text style={styles.menuLabel}>Notifications & Alerts</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuBox}>
        <Text style={styles.menuHeader}>Support & Safety</Text>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => Alert.alert('Fixora Support', '24/7 Helpline: +1 (800) 555-FIXORA\nEmail: support@fixora.care')}
        >
          <Text style={styles.menuIcon}>❓</Text>
          <Text style={styles.menuLabel}>Help & Support</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => Alert.alert('Fixora Privacy', 'Fixora encrypts all booking details and verifies caregiver background credentials.')}
        >
          <Text style={styles.menuIcon}>🔒</Text>
          <Text style={styles.menuLabel}>Privacy & Background Safety</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => Alert.alert('Terms & Conditions', 'Fixora Home & Care Platform Terms of Service v2.4')}
        >
          <Text style={styles.menuIcon}>📄</Text>
          <Text style={styles.menuLabel}>Terms & Conditions</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.85}>
        <Text style={styles.logoutText}>Log Out of Fixora</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    alignItems: 'center',
    marginBottom: 14,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    backgroundColor: '#F3F4F6',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  userEmail: {
    fontSize: 13,
    color: '#4B5563',
    marginVertical: 2,
  },
  userPhone: {
    fontSize: 12,
    color: '#6B7280',
  },
  roleBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 10,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E40AF',
  },
  switchRoleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E3A8A',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    elevation: 3,
  },
  adminRoleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    elevation: 3,
  },
  switchCol: {
    flex: 1,
  },
  switchTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  switchSub: {
    fontSize: 12,
    color: '#93C5FD',
    marginTop: 2,
  },
  adminTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  adminSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  switchArrow: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  menuBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    marginBottom: 14,
  },
  menuHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  menuArrow: {
    fontSize: 18,
    color: '#9CA3AF',
  },
  logoutBtn: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '800',
  },
});
