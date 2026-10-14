import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  Modal 
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';

export const BookingFlowScreen: React.FC = () => {
  const { 
    services, 
    providers, 
    user, 
    screenParams, 
    addBooking, 
    navigateTo, 
    goBack 
  } = useApp();

  const serviceId = screenParams?.serviceId || 'srv_elder_1';
  const providerId = screenParams?.providerId || 'prv_101';

  const selectedService = services.find(s => s.id === serviceId) || services[0];
  const selectedProvider = providers.find(p => p.id === providerId) || providers[0];

  // Steps state
  const [step, setStep] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-26');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:00 AM - 12:00 PM');
  const [address, setAddress] = useState<string>(user?.address || '42 Maplewood Avenue, Suite 4B');
  const [landmark, setLandmark] = useState<string>('Near Central Park Gate');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  
  // Success Modal
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string>('');

  const datesList = [
    { date: '2026-08-26', day: 'Wed', label: 'Aug 26' },
    { date: '2026-08-27', day: 'Thu', label: 'Aug 27' },
    { date: '2026-08-28', day: 'Fri', label: 'Aug 28' },
    { date: '2026-08-29', day: 'Sat', label: 'Aug 29' },
    { date: '2026-08-30', day: 'Sun', label: 'Aug 30' },
  ];

  const timeSlots = [
    '08:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '01:00 PM - 03:00 PM',
    '03:30 PM - 05:30 PM',
    '06:00 PM - 08:00 PM',
  ];

  const serviceCharge = selectedService.startingPrice;
  const additionalCharge = 415;
  const totalAmount = serviceCharge + additionalCharge;

  const handleConfirmBooking = async () => {
    const bookingId = await addBooking({
      customerId: user?.id || 'cust_101',
      providerId: selectedProvider.id,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      providerName: selectedProvider.name,
      providerImage: selectedProvider.profileImage,
      categoryType: selectedService.categoryType,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      address,
      landmark,
      serviceCharge,
      additionalCharge,
      totalAmount,
      paymentMethod: 'Fixora Pay / Credit Card',
      specialInstructions,
    });

    setConfirmedBookingId(bookingId);
    setShowSuccessModal(true);
  };

  return (
    <View style={styles.container}>
      <Header title={`Book Service (${step}/5)`} showBack={true} />

      {/* Step Indicator */}
      <View style={styles.stepperHeader}>
        {[1, 2, 3, 4, 5].map((s) => (
          <View key={s} style={styles.stepItem}>
            <View style={[styles.stepCircle, step >= s && styles.activeStepCircle]}>
              <Text style={[styles.stepNumber, step >= s && styles.activeStepNumber]}>
                {s}
              </Text>
            </View>
            <Text style={[styles.stepLabel, step >= s && styles.activeStepLabel]}>
              {s === 1 ? 'Summary' : s === 2 ? 'Date' : s === 3 ? 'Time' : s === 4 ? 'Address' : 'Confirm'}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Step 1: Summary */}
        {step === 1 && (
          <View style={styles.stepBox}>
            <Text style={styles.stepTitle}>Step 1: Service & Provider Summary</Text>

            <View style={styles.summaryCard}>
              <Image source={{ uri: selectedService.image }} style={styles.serviceImage} />
              <View style={styles.summaryContent}>
                <Text style={styles.serviceTitle}>{selectedService.name}</Text>
                <Text style={styles.categoryBadge}>{selectedService.category}</Text>
                <Text style={styles.priceTag}>₹{selectedService.startingPrice} {selectedService.unit}</Text>
              </View>
            </View>

            <View style={styles.providerBox}>
              <Text style={styles.boxLabel}>Assigned Caregiver / Technician</Text>
              <View style={styles.providerRow}>
                <Image source={{ uri: selectedProvider.profileImage }} style={styles.prvAvatar} />
                <View style={styles.prvInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.prvName}>{selectedProvider.name}</Text>
                    {selectedProvider.verified ? (
                      <View style={styles.vBadge}>
                        <Text style={styles.vCheck}>✓ Verified</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.prvExp}>{selectedProvider.experienceYears} yrs experience • ★ {selectedProvider.rating}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Step 2: Date */}
        {step === 2 && (
          <View style={styles.stepBox}>
            <Text style={styles.stepTitle}>Step 2: Select Date</Text>
            <Text style={styles.stepSub}>Choose a date for your appointment</Text>

            <View style={styles.datesGrid}>
              {datesList.map(item => {
                const isSelected = selectedDate === item.date;
                return (
                  <TouchableOpacity
                    key={item.date}
                    style={[styles.dateCard, isSelected && styles.activeDateCard]}
                    onPress={() => setSelectedDate(item.date)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.dayText, isSelected && styles.activeDayText]}>{item.day}</Text>
                    <Text style={[styles.dateText, isSelected && styles.activeDateText]}>{item.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Step 3: Time Slot */}
        {step === 3 && (
          <View style={styles.stepBox}>
            <Text style={styles.stepTitle}>Step 3: Select Time Slot</Text>
            <Text style={styles.stepSub}>Available slots for {selectedDate}</Text>

            <View style={styles.slotsList}>
              {timeSlots.map(slot => {
                const isSelected = selectedTimeSlot === slot;
                return (
                  <TouchableOpacity
                    key={slot}
                    style={[styles.slotCard, isSelected && styles.activeSlotCard]}
                    onPress={() => setSelectedTimeSlot(slot)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.slotIcon}>{isSelected ? '🔘' : '⚪'}</Text>
                    <Text style={[styles.slotText, isSelected && styles.activeSlotText]}>{slot}</Text>
                    {isSelected ? <Text style={styles.slotAvail}>Available</Text> : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Step 4: Service Address */}
        {step === 4 && (
          <View style={styles.stepBox}>
            <Text style={styles.stepTitle}>Step 4: Service Address</Text>
            <Text style={styles.stepSub}>Where should the service provider arrive?</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Street Address *</Text>
              <TextInput
                style={styles.input}
                placeholder="House No, Street, City"
                value={address}
                onChangeText={setAddress}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Landmark / Gate Access Code</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Opposite Metro Station / Gate code 4821"
                value={landmark}
                onChangeText={setLandmark}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Special Care Instructions (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="e.g. Ring side door, senior user has mobility aid..."
                value={specialInstructions}
                onChangeText={setSpecialInstructions}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        )}

        {/* Step 5: Order Summary */}
        {step === 5 && (
          <View style={styles.stepBox}>
            <Text style={styles.stepTitle}>Step 5: Review & Confirm</Text>

            <View style={styles.receiptBox}>
              <View style={styles.receiptHeader}>
                <Text style={styles.receiptService}>{selectedService.name}</Text>
                <Text style={styles.receiptProvider}>Provider: {selectedProvider.name}</Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptIcon}>📅</Text>
                <Text style={styles.receiptVal}>{selectedDate} at {selectedTimeSlot}</Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptIcon}>📍</Text>
                <Text style={styles.receiptVal} numberOfLines={2}>{address} ({landmark})</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.chargeRow}>
                <Text style={styles.chargeLabel}>Base Service Rate</Text>
                <Text style={styles.chargeVal}>${serviceCharge}</Text>
              </View>

              <View style={styles.chargeRow}>
                <Text style={styles.chargeLabel}>Safety & Insurance Fee</Text>
                <Text style={styles.chargeVal}>$10</Text>
              </View>

              <View style={[styles.chargeRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalVal}>${serviceCharge + 10}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Step Actions */}
      <View style={styles.bottomNav}>
        {step > 1 ? (
          <TouchableOpacity style={styles.prevBtn} onPress={() => setStep(step - 1)}>
            <Text style={styles.prevBtnText}>‹ Back</Text>
          </TouchableOpacity>
        ) : <View />}

        {step < 5 ? (
          <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(step + 1)}>
            <Text style={styles.nextBtnText}>Continue ›</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmBooking}>
            <Text style={styles.confirmBtnText}>Confirm Booking 💳</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successModalCard}>
            <View style={styles.checkBadge}>
              <Text style={styles.checkIcon}>✓</Text>
            </View>

            <Text style={styles.successTitle}>Booking Successful!</Text>
            <Text style={styles.successSub}>
              Your appointment has been created and assigned to {selectedProvider.name}.
            </Text>

            <View style={styles.idBox}>
              <Text style={styles.idLabel}>BOOKING ID</Text>
              <Text style={styles.idValue}>{confirmedBookingId}</Text>
            </View>

            <TouchableOpacity
              style={styles.trackBtn}
              onPress={() => {
                setShowSuccessModal(false);
                navigateTo('BookingDetails', { bookingId: confirmedBookingId });
              }}
            >
              <Text style={styles.trackBtnText}>Track Booking Status →</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.homeBtn}
              onPress={() => {
                setShowSuccessModal(false);
                navigateTo('MainTab');
              }}
            >
              <Text style={styles.homeBtnText}>Return to Home</Text>
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
  stepperHeader: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  activeStepCircle: {
    backgroundColor: '#2563EB',
  },
  stepNumber: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  activeStepNumber: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  activeStepLabel: {
    color: '#1E40AF',
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
  },
  stepBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    elevation: 2,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  stepSub: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 16,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  serviceImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  summaryContent: {
    flex: 1,
    justifyContent: 'center',
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  categoryBadge: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '600',
    marginVertical: 2,
  },
  priceTag: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  providerBox: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  boxLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prvAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  prvInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  prvName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
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
  prvExp: {
    fontSize: 12,
    color: '#4B5563',
  },
  datesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 10,
  },
  dateCard: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeDateCard: {
    backgroundColor: '#2563EB',
    borderColor: '#1D4ED8',
  },
  dayText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  activeDayText: {
    color: '#93C5FD',
  },
  dateText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
    marginTop: 2,
  },
  activeDateText: {
    color: '#FFFFFF',
  },
  slotsList: {
    gap: 10,
    marginTop: 10,
  },
  slotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeSlotCard: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  slotIcon: {
    fontSize: 14,
    marginRight: 10,
  },
  slotText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  activeSlotText: {
    color: '#1E40AF',
    fontWeight: '700',
  },
  slotAvail: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  receiptBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
  },
  receiptHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 10,
    marginBottom: 10,
  },
  receiptService: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  receiptProvider: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 2,
  },
  receiptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  receiptIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  receiptVal: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 10,
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
    borderTopColor: '#D1D5DB',
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
  bottomNav: {
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
    paddingHorizontal: 16,
  },
  prevBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  prevBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  nextBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  nextBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  confirmBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    elevation: 5,
  },
  checkBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkIcon: {
    fontSize: 32,
    color: '#059669',
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  successSub: {
    fontSize: 13,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  idBox: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  idLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1,
  },
  idValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1E40AF',
    marginTop: 2,
  },
  trackBtn: {
    backgroundColor: '#2563EB',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  trackBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  homeBtn: {
    paddingVertical: 8,
  },
  homeBtnText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
  },
});
