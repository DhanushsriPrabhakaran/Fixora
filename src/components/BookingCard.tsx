import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Booking, BookingStatus } from '../types';
import { useApp } from '../context/AppContext';

interface BookingCardProps {
  booking: Booking;
  onRate?: () => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking, onRate }) => {
  const { navigateTo, cancelBooking } = useApp();

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return { bg: '#DBEAFE', text: '#1E40AF', label: 'Confirmed' };
      case 'provider_assigned':
        return { bg: '#E0E7FF', text: '#3730A3', label: 'Provider Assigned' };
      case 'on_the_way':
        return { bg: '#FEF3C7', text: '#92400E', label: 'On The Way' };
      case 'in_progress':
        return { bg: '#FCE7F3', text: '#9D174D', label: 'In Progress' };
      case 'completed':
        return { bg: '#D1FAE5', text: '#065F46', label: 'Completed' };
      case 'cancelled':
        return { bg: '#FEE2E2', text: '#991B1B', label: 'Cancelled' };
      default:
        return { bg: '#F3F4F6', text: '#374151', label: status };
    }
  };

  const statusStyle = getStatusColor(booking.status);
  const isCanCancel = booking.status === 'confirmed' || booking.status === 'provider_assigned';
  const isCompleted = booking.status === 'completed';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.idRow}>
          <Text style={styles.bookingId}>ID: {booking.id}</Text>
          <Text style={styles.dateLabel}>{booking.createdAt}</Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.statusText, { color: statusStyle.text }]}>
            {statusStyle.label}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <Image source={{ uri: booking.providerImage }} style={styles.providerAvatar} />
        
        <View style={styles.details}>
          <Text style={styles.serviceName}>{booking.serviceName}</Text>
          <Text style={styles.providerName}>Provider: {booking.providerName}</Text>
          
          <View style={styles.timeRow}>
            <Text style={styles.timeIcon}>📅</Text>
            <Text style={styles.timeText}>
              {booking.date}  •  {booking.timeSlot}
            </Text>
          </View>

          <View style={styles.timeRow}>
            <Text style={styles.timeIcon}>📍</Text>
            <Text style={styles.addressText} numberOfLines={1}>
              {booking.address}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.totalPrice}>₹{booking.totalAmount}</Text>

        <View style={styles.btnRow}>
          {isCanCancel ? (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => cancelBooking(booking.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          ) : null}

          {isCompleted && !booking.ratingGiven ? (
            <TouchableOpacity
              style={styles.rateBtn}
              onPress={() => onRate && onRate()}
              activeOpacity={0.8}
            >
              <Text style={styles.rateBtnText}>Rate Service</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={styles.detailsBtn}
            onPress={() => navigateTo('BookingDetails', { bookingId: booking.id })}
            activeOpacity={0.8}
          >
            <Text style={styles.detailsBtnText}>Track & Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 10,
    marginBottom: 10,
  },
  idRow: {
    flexDirection: 'column',
  },
  bookingId: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  dateLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  providerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#F3F4F6',
  },
  details: {
    flex: 1,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  providerName: {
    fontSize: 12,
    color: '#4B5563',
    marginBottom: 4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  timeIcon: {
    fontSize: 11,
    marginRight: 4,
  },
  timeText: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '500',
  },
  addressText: {
    fontSize: 11,
    color: '#6B7280',
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
  },
  totalPrice: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E40AF',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelBtn: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cancelBtnText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
  },
  rateBtn: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  rateBtnText: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: '700',
  },
  detailsBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  detailsBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
