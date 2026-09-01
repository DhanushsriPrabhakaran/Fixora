import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { RatingStars } from '../components/RatingStars';

export const ProviderProfileScreen: React.FC = () => {
  const { 
    providers, 
    screenParams, 
    favouriteProviderIds, 
    toggleFavouriteProvider, 
    navigateTo 
  } = useApp();

  const providerId = screenParams?.providerId || 'prv_101';
  const provider = providers.find(p => p.id === providerId) || providers[0];
  const isFav = favouriteProviderIds.includes(provider.id);

  return (
    <View style={styles.container}>
      <Header title="Provider Profile" showBack={true} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card Header */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.topInfoRow}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: provider.profileImage }} style={styles.avatar} />
              {provider.verified ? (
                <View style={styles.vBadge}>
                  <Text style={styles.vCheck}>✓</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.headerTextCol}>
              <View style={styles.nameFavRow}>
                <Text style={styles.name}>{provider.name}</Text>
                <TouchableOpacity onPress={() => toggleFavouriteProvider(provider.id)}>
                  <Text style={styles.favIcon}>{isFav ? '❤️' : '🤍'}</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.tagline}>{provider.tagline}</Text>
              
              <View style={styles.ratingRow}>
                <RatingStars rating={provider.rating} size={14} reviewsCount={provider.reviewsCount} />
              </View>
            </View>
          </View>

          {/* Quick Metrics */}
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>{provider.experienceYears}+ Yrs</Text>
              <Text style={styles.metricLbl}>Experience</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>{provider.rating.toFixed(1)} ★</Text>
              <Text style={styles.metricLbl}>Rating</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>₹{provider.startingPrice}</Text>
              <Text style={styles.metricLbl}>Starting Rate</Text>
            </View>
          </View>
        </View>

        {/* Verification Status Banner */}
        {provider.verified ? (
          <View style={styles.verifiedBanner}>
            <Text style={styles.shieldIcon}>🛡️</Text>
            <View style={styles.vTextCol}>
              <Text style={styles.vTitle}>Fixora Verified & Background Checked</Text>
              <Text style={styles.vSub}>Government ID, criminal check, and skill credentials verified.</Text>
            </View>
          </View>
        ) : null}

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About {provider.name}</Text>
          <Text style={styles.bioText}>{provider.bio}</Text>
        </View>

        {/* Qualifications & Certifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Qualifications & Credentials</Text>
          <View style={styles.tagList}>
            {provider.qualifications.map((q, idx) => (
              <View key={`q_${idx}`} style={styles.qualTag}>
                <Text style={styles.qualText}>🎓 {q}</Text>
              </View>
            ))}
            {provider.certifications.map((c, idx) => (
              <View key={`c_${idx}`} style={styles.certTag}>
                <Text style={styles.certText}>📜 {c}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Service Details & Area */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Information</Text>
          
          <View style={styles.infoBox}>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>🗣️</Text>
              <View style={styles.infoCol}>
                <Text style={styles.infoTitle}>Languages Spoken</Text>
                <Text style={styles.infoVal}>{provider.languages.join(', ')}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>📍</Text>
              <View style={styles.infoCol}>
                <Text style={styles.infoTitle}>Service Area</Text>
                <Text style={styles.infoVal}>{provider.serviceArea}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>⏰</Text>
              <View style={styles.infoCol}>
                <Text style={styles.infoTitle}>Availability</Text>
                <Text style={styles.infoVal}>{provider.availabilityStatus}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Customer Reviews List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Reviews ({provider.reviews.length})</Text>
          
          {provider.reviews.length > 0 ? (
            provider.reviews.map(rev => (
              <View key={rev.id} style={styles.reviewCard}>
                <View style={styles.revHeader}>
                  <Text style={styles.revName}>{rev.customerName}</Text>
                  <Text style={styles.revDate}>{rev.date}</Text>
                </View>
                <RatingStars rating={rev.rating} size={12} showNumeric={false} />
                <Text style={styles.revSrvName}>Service: {rev.serviceName}</Text>
                <Text style={styles.revComment}>{rev.comment}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noReviews}>No reviews submitted yet for this provider.</Text>
          )}
        </View>
      </ScrollView>

      {/* Floating Bottom Booking Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Starting from</Text>
          <Text style={styles.bottomPrice}>₹{provider.startingPrice} <Text style={styles.bottomUnit}>/ hr</Text></Text>
        </View>

        <TouchableOpacity 
          style={styles.bookNowBtn}
          onPress={() => navigateTo('BookingFlow', { providerId: provider.id })}
          activeOpacity={0.85}
        >
          <Text style={styles.bookNowText}>Book Appointment →</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 90,
  },
  profileHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },
  topInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#F3F4F6',
  },
  vBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#059669',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  vCheck: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  headerTextCol: {
    flex: 1,
  },
  nameFavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  favIcon: {
    fontSize: 16,
  },
  tagline: {
    fontSize: 12,
    color: '#4B5563',
    marginVertical: 4,
    lineHeight: 16,
  },
  ratingRow: {
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  metricLbl: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
  },
  verifiedBanner: {
    flexDirection: 'row',
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 14,
  },
  shieldIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  vTextCol: {
    flex: 1,
  },
  vTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46',
  },
  vSub: {
    fontSize: 11,
    color: '#047857',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
  },
  bioText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 19,
  },
  tagList: {
    gap: 8,
  },
  qualTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  qualText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '600',
  },
  certTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  certText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '600',
  },
  infoBox: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  infoCol: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 11,
    color: '#6B7280',
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  reviewCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  revHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  revName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  revDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  revSrvName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563EB',
    marginVertical: 2,
  },
  revComment: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 16,
  },
  noReviews: {
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    elevation: 8,
  },
  bottomLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  bottomPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  bottomUnit: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
  },
  bookNowBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  bookNowText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
