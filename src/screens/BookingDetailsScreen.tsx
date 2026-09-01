import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Modal, 
  TextInput 
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { RatingStars } from '../components/RatingStars';
import { BookingStatus } from '../types';

export const BookingDetailsScreen: React.FC = () => {
  const { 
    bookings, 
    screenParams, 
    cancelBooking, 
    updateBookingStatus, 
    addReview, 
    navigateTo,
    goBack 
  } = useApp();

  const bookingId = screenParams?.bookingId || 'FIX-9021';
  const booking = bookings.find(b => b.id === bookingId) || bookings[0];

  // Rating Modal state
  const [showRatingModal, setShowRatingModal] = useState<boolean>(false);
  const [userRating, setUserRating] = useState<number>(5);
  const [userComment, setUserComment] = useState<string>('');

  const statusSteps: { status: BookingStatus; label: string; icon: string }[] = [
    { status: 'confirmed', label: 'Confirmed', icon: '📝' },
    { status: 'provider_assigned', label: 'Assigned', icon: '👨‍🔧' },
    { status: 'on_the_way', label: 'On The Way', icon: '🚗' },
    { status: 'in_progress', label: 'In Progress', icon: '⚡' },
    { status: 'completed', label: 'Completed', icon: '🎉' },
  ];

  const getStepIndex = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed': return 0;
      case 'provider_assigned': return 1;
      case 'on_the_way': return 2;
      case 'in_progress': return 3;
      case 'completed': return 4;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(booking.status);

  const handleReviewSubmit = () => {
    if (userComment.trim()) {
      addReview(booking.providerId, userRating, userComment, booking.serviceName);
    }
    setShowRatingModal(false);
  };

  return (
    <View style={styles.container}>
      <Header title={`Booking Details (${booking.id})`} showBack={true} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status Stepper Card */}
        <View style={styles.statusCard}>
          <Text style={styles.cardSectionTitle}>Live Status Tracker</Text>

          {booking.status === 'cancelled' ? (
            <View style={styles.cancelledBanner}>
              <Text style={styles.cancelledIcon}>❌</Text>
              <Text style={styles.cancelledText}>This booking has been cancelled.</Text>
            </View>
          ) : (
            <View style={styles.stepperRow}>
              {statusSteps.map((st, idx) => {
                const isPassed = currentStepIdx >= idx;
                const isCurrent = currentStepIdx === idx;
                return (
                  <View key={st.status} style={styles.stepperItem}>
                    <View style={[styles.stepCircle, isPassed && styles.passedCircle, isCurrent && styles.currentCircle]}>
                      <Text style={styles.stepIcon}>{st.icon}</Text>
                    </View>
                    <Text style={[styles.stepText, isPassed && styles.passedStepText]}>{st.label}</Text>
                    {idx < statusSteps.length - 1 ? (
                      <View style={[styles.stepLine, currentStepIdx > idx && styles.passedStepLine]} />
                    ) : null}
                  </View>
                );
              })}
            </View>
          )}

          {/* Quick Demo Controls for testing status updates */}
          <View style={styles.demoControlBox}>
            <Text style={styles.demoControlLabel}>Simulate Status Update (Demo):</Text>
            <View style={styles.demoBtnsRow}>
              <TouchableOpacity 
                style={styles.demoStatusBtn}
                onPress={() => updateBookingStatus(booking.id, 'on_the_way')}
              >
                <Text style={styles.demoStatusText}>On Way</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.demoStatusBtn}
                onPress={() => updateBookingStatus(booking.id, 'in_progress')}
              >
                <Text style={styles.demoStatusText}>Started</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.demoStatusBtnDone}
                onPress={() => updateBookingStatus(booking.id, 'completed')}
              >
                <Text style={styles.demoStatusTextDone}>Complete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Assigned Provider Box */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Assigned Caregiver / Specialist</Text>
          
          <View style={styles.providerRow}>
            <Image source={{ uri: booking.providerImage }} style={styles.providerAvatar} />
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>{booking.providerName}</Text>
              <Text style={styles.serviceName}>{booking.serviceName}</Text>
              <Text style={styles.contactBadge}>📞 +1 (555) 892-4190</Text>
            </View>
          </View>
        </View>

        {/* Appointment Details */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Appointment Info</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📅</Text>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Date & Time Slot</Text>
              <Text style={styles.infoValue}>{booking.date}  •  {booking.timeSlot}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Service Location</Text>
              <Text style={styles.infoValue}>{booking.address}</Text>
              {booking.landmark ? <Text style={styles.landmarkText}>Landmark: {booking.landmark}</Text> : null}
            </View>
          </View>

          {booking.specialInstructions ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📝</Text>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Special Instructions</Text>
                <Text style={styles.infoValue}>{booking.specialInstructions}</Text>
              </View>
            </View>
          ) : null}
        </View>

        {/* Payment & Charges */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Payment Summary</Text>

          <View style={styles.chargeRow}>
            <Text style={styles.chargeLabel}>Service Fee</Text>
            <Text style={styles.chargeVal}>₹{booking.serviceCharge}</Text>
          </View>

          <View style={styles.chargeRow}>
            <Text style={styles.chargeLabel}>Dispatch & Safety Charge</Text>
            <Text style={styles.chargeVal}>₹{booking.additionalCharge}</Text>
          </View>

          <View style={[styles.chargeRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalVal}>₹{booking.totalAmount}</Text>
          </View>
          
          <Text style={styles.paymentMethod}>Paid via {booking.paymentMethod}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsBox}>
          <TouchableOpacity 
            style={styles.chatBtn}
            onPress={() => navigateTo('Chat', { bookingId: booking.id, providerName: booking.providerName })}
            activeOpacity={0.8}
          >
            <Text style={styles.chatBtnText}>💬 Chat with Provider</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.disputeBtn}
            onPress={() => navigateTo('Complaints')}
            activeOpacity={0.8}
          >
            <Text style={styles.disputeBtnText}>🎧 Help / Raise Dispute</Text>
          </TouchableOpacity>

          {booking.status === 'completed' ? (
            <TouchableOpacity 
              style={styles.reviewBtn}
              onPress={() => setShowRatingModal(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.reviewBtnText}>⭐ Leave Rating & Review</Text>
            </TouchableOpacity>
          ) : booking.status !== 'cancelled' ? (
            <TouchableOpacity 
              style={styles.cancelBtn}
              onPress={() => cancelBooking(booking.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelBtnText}>Cancel Booking</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>

      {/* Rating & Review Modal */}
      <Modal visible={showRatingModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>How was your service?</Text>
            <Text style={styles.modalSub}>Rate your experience with {booking.providerName}</Text>

            <View style={styles.starsWrapper}>
              <RatingStars 
                rating={userRating} 
                size={32} 
                interactive={true} 
                onRatingChange={setUserRating}
                showNumeric={false} 
              />
            </View>

            <TextInput
              style={styles.reviewInput}
              placeholder="Write a feedback review for the caregiver..."
              value={userComment}
              onChangeText={setUserComment}
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity 
              style={styles.submitReviewBtn}
              onPress={handleReviewSubmit}
              activeOpacity={0.85}
            >
              <Text style={styles.submitReviewText}>Submit Review</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.closeModalBtn}
              onPress={() => setShowRatingModal(false)}
            >
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 40,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },
  cardSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  stepperItem: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  passedCircle: {
    backgroundColor: '#D1FAE5',
    borderColor: '#059669',
  },
  currentCircle: {
    backgroundColor: '#DBEAFE',
    borderColor: '#2563EB',
  },
  stepIcon: {
    fontSize: 14,
  },
  stepText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  passedStepText: {
    color: '#111827',
    fontWeight: '700',
  },
  stepLine: {
    position: 'absolute',
    top: 15,
    right: -25,
    width: 50,
    height: 2,
    backgroundColor: '#E5E7EB',
    zIndex: -1,
  },
  passedStepLine: {
    backgroundColor: '#059669',
  },
  cancelledBanner: {
    flexDirection: 'row',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelledIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  cancelledText: {
    color: '#991B1B',
    fontSize: 13,
    fontWeight: '700',
  },
  demoControlBox: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
  },
  demoControlLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 6,
  },
  demoBtnsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  demoStatusBtn: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  demoStatusText: {
    color: '#1D4ED8',
    fontSize: 11,
    fontWeight: '700',
  },
  demoStatusBtnDone: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  demoStatusTextDone: {
    color: '#047857',
    fontSize: 11,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 14,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 14,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  serviceName: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '600',
    marginVertical: 2,
  },
  contactBadge: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 12,
    marginTop: 2,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  landmarkText: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 2,
  },
  chargeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  chargeLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  chargeVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1E40AF',
  },
  paymentMethod: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '700',
    marginTop: 6,
  },
  actionsBox: {
    marginTop: 6,
    gap: 10,
  },
  chatBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  chatBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  disputeBtn: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  disputeBtnText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '700',
  },
  reviewBtn: {
    backgroundColor: '#F59E0B',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  reviewBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  cancelBtn: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  modalSub: {
    fontSize: 12,
    color: '#6B7280',
    marginVertical: 4,
  },
  starsWrapper: {
    marginVertical: 16,
  },
  reviewInput: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  submitReviewBtn: {
    backgroundColor: '#2563EB',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  submitReviewText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  closeModalBtn: {
    paddingVertical: 6,
  },
  closeModalText: {
    color: '#6B7280',
    fontSize: 13,
  },
});
