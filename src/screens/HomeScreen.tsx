import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { useApp } from '../context/AppContext';
import { MOCK_CATEGORIES } from '../data/mockData';
import { CategoryCard } from '../components/CategoryCard';
import { ServiceCard } from '../components/ServiceCard';
import { ProviderCard } from '../components/ProviderCard';
import { BookingCard } from '../components/BookingCard';

export const HomeScreen: React.FC = () => {
  const { user, services, providers, bookings, navigateTo, setFilterOptions } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const popularServices = services.filter(s => s.popular);
  const activeBookings = bookings.filter(
    b => b.status === 'confirmed' || b.status === 'provider_assigned' || b.status === 'on_the_way' || b.status === 'in_progress'
  );

  const handleSearchSubmit = () => {
    setFilterOptions(prev => ({ ...prev, searchQuery }));
    navigateTo('Services');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Hero Greeting Section */}
      <View style={styles.heroSection}>
        <View style={styles.userRow}>
          <View>
            <Text style={styles.greetingSub}>Welcome back 👋</Text>
            <Text style={styles.greetingName}>Good Morning, {user?.name || 'Guest'}</Text>
          </View>
          <TouchableOpacity onPress={() => navigateTo('Profile')} activeOpacity={0.8}>
            <Image 
              source={{ uri: user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' }} 
              style={styles.profileAvatar} 
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search plumber, cleaning, elder care, babysitter..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearSearchIcon}>✕</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity style={styles.filterBtn} onPress={handleSearchSubmit}>
            <Text style={styles.filterBtnText}>Go</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Promotional Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerContent}>
          <View style={styles.badgePill}>
            <Text style={styles.badgePillText}>Fixora Shield Verified</Text>
          </View>
          <Text style={styles.bannerTitle}>Trusted Home & Family Care</Text>
          <Text style={styles.bannerSub}>Get ₹1,245 off your first Elder or Child Care booking!</Text>
          <TouchableOpacity 
            style={styles.bannerCta}
            onPress={() => navigateTo('ElderCare')}
            activeOpacity={0.85}
          >
            <Text style={styles.bannerCtaText}>Explore Care Services →</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Booking Widget if exists */}
      {activeBookings.length > 0 ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⚡ Active Booking Status</Text>
            <TouchableOpacity onPress={() => navigateTo('Bookings')}>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <BookingCard booking={activeBookings[0]} />
        </View>
      ) : null}

      {/* Categories Horizontal */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
          <TouchableOpacity onPress={() => navigateTo('Services')}>
            <Text style={styles.seeAllText}>All Services ›</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
          {MOCK_CATEGORIES.map(cat => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </ScrollView>
      </View>

      {/* First-Class Dedicated Family Care Cards */}
      <View style={styles.familyCareGrid}>
        {/* Elder Care Banner */}
        <TouchableOpacity
          style={styles.elderCareCard}
          activeOpacity={0.88}
          onPress={() => navigateTo('ElderCare')}
        >
          <View style={styles.elderBadgeRow}>
            <Text style={styles.elderBadge}>👵 ELDERLY CARE</Text>
            <View style={styles.verifiedDot}>
              <Text style={styles.verifiedDotText}>✓ Verified</Text>
            </View>
          </View>
          <Text style={styles.careCardTitle}>Trusted Elder Assistance</Text>
          <Text style={styles.careCardSub}>Companions, medicine reminders, doctor visit escorts & overnight care.</Text>
          <View style={styles.careFooter}>
            <Text style={styles.careLinkText}>Explore Caregivers →</Text>
          </View>
        </TouchableOpacity>

        {/* Child Care Banner */}
        <TouchableOpacity
          style={styles.childCareCard}
          activeOpacity={0.88}
          onPress={() => navigateTo('ChildCare')}
        >
          <View style={styles.elderBadgeRow}>
            <Text style={styles.childBadge}>👶 CHILD CARE</Text>
            <View style={styles.verifiedDotChild}>
              <Text style={styles.verifiedDotText}>🛡️ Safety Checked</Text>
            </View>
          </View>
          <Text style={styles.careCardTitle}>Safe & Verified Childcare</Text>
          <Text style={styles.careCardSub}>Babysitting, infant specialists, school pickup & homework help.</Text>
          <View style={styles.careFooter}>
            <Text style={styles.careLinkTextChild}>Explore Babysitters →</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Popular Services */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Services</Text>
          <TouchableOpacity onPress={() => navigateTo('Services')}>
            <Text style={styles.seeAllText}>See All ›</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {popularServices.map(srv => (
            <ServiceCard key={srv.id} service={srv} horizontal />
          ))}
        </ScrollView>
      </View>

      {/* Recommended Providers */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Verified Providers</Text>
          <TouchableOpacity onPress={() => navigateTo('Services')}>
            <Text style={styles.seeAllText}>See All ›</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {providers.map(prv => (
            <ProviderCard key={prv.id} provider={prv} horizontal />
          ))}
        </ScrollView>
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
    paddingBottom: 24,
  },
  heroSection: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  greetingSub: {
    fontSize: 12,
    color: '#93C5FD',
    fontWeight: '500',
  },
  greetingName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#60A5FA',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    elevation: 4,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#111827',
    paddingVertical: 8,
  },
  clearSearchIcon: {
    fontSize: 14,
    color: '#9CA3AF',
    paddingHorizontal: 6,
  },
  filterBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    marginLeft: 4,
  },
  filterBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  banner: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#312E81',
    borderRadius: 16,
    padding: 18,
    elevation: 3,
  },
  bannerContent: {
    alignItems: 'flex-start',
  },
  badgePill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  badgePillText: {
    color: '#4338CA',
    fontSize: 11,
    fontWeight: '800',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bannerSub: {
    fontSize: 13,
    color: '#C7D2FE',
    marginBottom: 14,
  },
  bannerCta: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bannerCtaText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  categoryRow: {
    paddingRight: 16,
  },
  horizontalList: {
    paddingRight: 16,
  },
  familyCareGrid: {
    paddingHorizontal: 16,
    marginTop: 20,
    gap: 14,
  },
  elderCareCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FCD34D',
    padding: 16,
    elevation: 2,
  },
  elderBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  elderBadge: {
    fontSize: 11,
    fontWeight: '900',
    color: '#B45309',
    letterSpacing: 0.5,
  },
  verifiedDot: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  verifiedDotText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065F46',
  },
  childCareCard: {
    backgroundColor: '#FDF2F8',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#F9A8D4',
    padding: 16,
    elevation: 2,
  },
  childBadge: {
    fontSize: 11,
    fontWeight: '900',
    color: '#BE185D',
    letterSpacing: 0.5,
  },
  verifiedDotChild: {
    backgroundColor: '#FCE7F3',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  careCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  careCardSub: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 17,
    marginBottom: 12,
  },
  careFooter: {
    alignSelf: 'flex-start',
  },
  careLinkText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#D97706',
  },
  careLinkTextChild: {
    fontSize: 13,
    fontWeight: '800',
    color: '#DB2777',
  },
});
