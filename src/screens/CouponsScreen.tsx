import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useApp } from '../context/AppContext';

export const CouponsScreen: React.FC = () => {
  const { offers, appliedOffer, applyOffer, clearOffer, goBack } = useApp();
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCustom = () => {
    if (!couponInput.trim()) return;
    const res = applyOffer(couponInput.trim(), 100); // Test amount $100
    Alert.alert(res.success ? 'Success' : 'Notice', res.message);
    if (res.success) {
      setCouponInput('');
    }
  };

  const handleSelectOffer = (code: string) => {
    const res = applyOffer(code, 100);
    Alert.alert(res.success ? 'Success' : 'Notice', res.message);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Offers & Discounts</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.inputCard}>
          <Text style={styles.cardTitle}>Have a Coupon Code?</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Enter Code (e.g. FIXORA10)"
              placeholderTextColor="#94A3B8"
              value={couponInput}
              onChangeText={setCouponInput}
              autoCapitalize="characters"
            />
            <TouchableOpacity style={styles.applyBtn} onPress={handleApplyCustom}>
              <Text style={styles.applyBtnText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>

        {appliedOffer && (
          <View style={styles.activeOfferBanner}>
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>Active Code: {appliedOffer.code}</Text>
              <Text style={styles.bannerSub}>{appliedOffer.title} applied to your next booking.</Text>
            </View>
            <TouchableOpacity style={styles.removeBtn} onPress={clearOffer}>
              <Text style={styles.removeBtnText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionTitle}>Available Promotional Offers</Text>
        {offers.map(o => {
          const isApplied = appliedOffer?.code === o.code;
          return (
            <View key={o.code} style={[styles.offerCard, isApplied && styles.appliedOfferCard]}>
              <View style={styles.offerHeader}>
                <View style={styles.codeBadge}>
                  <Text style={styles.codeText}>{o.code}</Text>
                </View>
                <Text style={styles.validText}>Valid until {o.validUntil}</Text>
              </View>

              <Text style={styles.offerTitle}>{o.title}</Text>
              <Text style={styles.offerDesc}>{o.description}</Text>

              <View style={styles.offerFooter}>
                <Text style={styles.minAmountText}>Min. Spend: ${o.minBookingAmount}</Text>
                <TouchableOpacity 
                  style={[styles.useBtn, isApplied && styles.appliedBtn]} 
                  onPress={() => handleSelectOffer(o.code)}
                >
                  <Text style={[styles.useBtnText, isApplied && styles.appliedBtnText]}>
                    {isApplied ? '✓ Applied' : 'Use Coupon'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  backText: { fontSize: 15, fontWeight: '600', color: '#2563EB' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#0F172A' },
  content: { padding: 16 },
  inputCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 10 },
  inputRow: { flexDirection: 'row' },
  input: { flex: 1, backgroundColor: '#F1F5F9', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: '#0F172A' },
  applyBtn: { marginLeft: 10, backgroundColor: '#2563EB', paddingHorizontal: 18, borderRadius: 8, justifyContent: 'center' },
  applyBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  activeOfferBanner: { backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#6EE7B7', padding: 14, borderRadius: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  bannerTitle: { fontSize: 14, fontWeight: '700', color: '#065F46' },
  bannerSub: { fontSize: 12, color: '#047857', marginTop: 2 },
  removeBtn: { backgroundColor: '#FEF2F2', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#FCA5A5' },
  removeBtnText: { fontSize: 12, fontWeight: '700', color: '#EF4444' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  offerCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  appliedOfferCard: { borderColor: '#10B981', borderWidth: 2 },
  offerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  codeBadge: { backgroundColor: '#EFF6FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderStyle: 'dashed', borderWidth: 1, borderColor: '#3B82F6' },
  codeText: { fontSize: 13, fontWeight: '800', color: '#2563EB' },
  validText: { fontSize: 11, color: '#94A3B8' },
  offerTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  offerDesc: { fontSize: 13, color: '#64748B', marginTop: 4 },
  offerFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  minAmountText: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  useBtn: { backgroundColor: '#2563EB', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 6 },
  appliedBtn: { backgroundColor: '#D1FAE5' },
  useBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  appliedBtnText: { color: '#10B981' }
});
