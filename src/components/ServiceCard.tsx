import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ServiceItem } from '../types';
import { useApp } from '../context/AppContext';
import { RatingStars } from './RatingStars';

interface ServiceCardProps {
  service: ServiceItem;
  onBook?: () => void;
  horizontal?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBook, horizontal = false }) => {
  const { favouriteServiceIds, toggleFavouriteService, navigateTo } = useApp();
  const isFav = favouriteServiceIds.includes(service.id);

  const isElderOrChild = service.categoryType === 'elder_care' || service.categoryType === 'child_care';

  const badgeColor = service.categoryType === 'elder_care' 
    ? '#FEF3C7' 
    : service.categoryType === 'child_care' 
      ? '#FCE7F3' 
      : '#DBEAFE';

  const badgeTextColor = service.categoryType === 'elder_care' 
    ? '#92400E' 
    : service.categoryType === 'child_care' 
      ? '#9D174D' 
      : '#1E40AF';

  return (
    <TouchableOpacity
      style={[styles.card, horizontal ? styles.horizontalCard : styles.verticalCard]}
      activeOpacity={0.85}
      onPress={() => {
        if (onBook) onBook();
        else navigateTo('Services', { serviceId: service.id });
      }}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: service.image }} style={styles.image} resizeMode="cover" />
        <TouchableOpacity
          style={styles.favBtn}
          onPress={() => toggleFavouriteService(service.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.favIcon}>{isFav ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>

        <View style={[styles.catBadge, { backgroundColor: badgeColor }]}>
          <Text style={[styles.catBadgeText, { color: badgeTextColor }]}>
            {service.category}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.icon}>{service.icon}</Text>
          <Text style={styles.name} numberOfLines={1}>
            {service.name}
          </Text>
        </View>

        <Text style={styles.desc} numberOfLines={2}>
          {service.description}
        </Text>

        <View style={styles.ratingRow}>
          <RatingStars rating={service.rating} size={13} showNumeric={true} />
          {service.popular ? (
            <View style={styles.popularPill}>
              <Text style={styles.popularText}>Popular</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={styles.priceLabel}>Starting from</Text>
            <Text style={styles.price}>
              ₹{service.startingPrice} <Text style={styles.unit}>{service.unit}</Text>
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.bookBtn, isElderOrChild && styles.careBookBtn]}
            onPress={() => {
              if (onBook) onBook();
              else navigateTo('Services', { serviceId: service.id });
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
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    marginBottom: 14,
  },
  horizontalCard: {
    width: 260,
    marginRight: 14,
    marginBottom: 6,
  },
  verticalCard: {
    width: '100%',
  },
  imageWrapper: {
    height: 120,
    width: '100%',
    position: 'relative',
    backgroundColor: '#F3F4F6',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favIcon: {
    fontSize: 14,
  },
  catBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  catBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  content: {
    padding: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    fontSize: 16,
    marginRight: 6,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  desc: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 16,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  popularPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  popularText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#D97706',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
  },
  priceLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E40AF',
  },
  unit: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
  },
  bookBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 7,
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
