import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ServiceProvider } from '../types';
import { useApp } from '../context/AppContext';
import { RatingStars } from './RatingStars';

interface ProviderCardProps {
  provider: ServiceProvider;
  onBook?: () => void;
  horizontal?: boolean;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider, onBook, horizontal = false }) => {
  const { favouriteProviderIds, toggleFavouriteProvider, navigateTo } = useApp();
  const isFav = favouriteProviderIds.includes(provider.id);

  const isCare = provider.categoryType === 'elder_care' || provider.categoryType === 'child_care';

  return (
    <TouchableOpacity
      style={[styles.card, horizontal ? styles.horizontalCard : styles.verticalCard]}
      activeOpacity={0.9}
      onPress={() => navigateTo('ProviderProfile', { providerId: provider.id })}
    >
      <View style={styles.topRow}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: provider.profileImage }} style={styles.avatar} />
          {provider.verified ? (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedCheck}>✓</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {provider.name}
            </Text>
            <TouchableOpacity
              onPress={() => toggleFavouriteProvider(provider.id)}
              activeOpacity={0.7}
              style={styles.favBtn}
            >
              <Text style={styles.favIcon}>{isFav ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.tagline} numberOfLines={1}>
            {provider.tagline}
          </Text>

          <View style={styles.metaRow}>
            <RatingStars rating={provider.rating} size={12} reviewsCount={provider.reviewsCount} />
            <Text style={styles.dot}>•</Text>
            <Text style={styles.expText}>{provider.experienceYears} yrs exp</Text>
          </View>
        </View>
      </View>

      {/* Qualifications & Badges */}
      <View style={styles.badgeRow}>
        {provider.verified ? (
          <View style={styles.vBadgePill}>
            <Text style={styles.vBadgeText}>🛡️ Fixora Verified</Text>
          </View>
        ) : null}

        {provider.emergencySupport ? (
          <View style={styles.emergPill}>
            <Text style={styles.emergText}>🚨 24/7 Emergency</Text>
          </View>
        ) : null}

        {provider.supportedAgeGroups && provider.supportedAgeGroups.length > 0 ? (
          <View style={styles.agePill}>
            <Text style={styles.ageText}>👶 {provider.supportedAgeGroups.join(', ')}</Text>
          </View>
        ) : null}
      </View>

      {/* Languages & Area */}
      <View style={styles.infoRow}>
        <Text style={styles.infoText} numberOfLines={1}>
          🗣️ {provider.languages.join(', ')}  •  📍 {provider.serviceArea}
        </Text>
      </View>

      {/* Footer Price & Actions */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.availText}>{provider.availabilityStatus}</Text>
          <Text style={styles.price}>
            ₹{provider.startingPrice} <Text style={styles.unit}>starting</Text>
          </Text>
        </View>

        <View style={styles.actionBtns}>
          <TouchableOpacity
            style={styles.viewProfileBtn}
            onPress={() => navigateTo('ProviderProfile', { providerId: provider.id })}
            activeOpacity={0.7}
          >
            <Text style={styles.viewProfileText}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.bookBtn, isCare && styles.careBookBtn]}
            onPress={() => {
              if (onBook) onBook();
              else navigateTo('BookingFlow', { providerId: provider.id });
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.bookBtnText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  horizontalCard: {
    width: 290,
    marginRight: 14,
    marginBottom: 6,
  },
  verticalCard: {
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#059669',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  verifiedCheck: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  favBtn: {
    padding: 2,
  },
  favIcon: {
    fontSize: 14,
  },
  tagline: {
    fontSize: 12,
    color: '#4B5563',
    marginVertical: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  dot: {
    color: '#9CA3AF',
    marginHorizontal: 4,
    fontSize: 10,
  },
  expText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563EB',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  vBadgePill: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  vBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#065F46',
  },
  emergPill: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  emergText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#991B1B',
  },
  agePill: {
    backgroundColor: '#FCE7F3',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ageText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#831843',
  },
  infoRow: {
    marginBottom: 12,
  },
  infoText: {
    fontSize: 11,
    color: '#6B7280',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
  },
  availText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  unit: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '400',
  },
  actionBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  viewProfileBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewProfileText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '700',
  },
  bookBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  careBookBtn: {
    backgroundColor: '#059669',
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
