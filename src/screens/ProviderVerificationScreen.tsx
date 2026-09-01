import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useApp } from '../context/AppContext';

export const ProviderVerificationScreen: React.FC = () => {
  const { user, submitVerification, goBack } = useApp();

  const [idNumber, setIdNumber] = useState('');
  const [certName, setCertName] = useState('');
  const [experience, setExperience] = useState('3');
  const [submitted, setSubmitted] = useState(user?.verificationStatus === 'pending' || user?.verificationStatus === 'approved');

  const handleSubmit = () => {
    if (!idNumber.trim() || !certName.trim()) {
      Alert.alert('Required Fields', 'Please provide your National ID / SSN and Certification details.');
      return;
    }
    submitVerification(user?.id || 'prv_101', `ID_${idNumber}`, certName);
    setSubmitted(true);
    Alert.alert('KYC Documents Submitted', 'Your verification documents have been sent to Fixora Admin. You will receive your verified badge upon review.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Provider KYC Verification</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>Current Verification Status:</Text>
          <Text style={[
            styles.statusBadge, 
            user?.verificationStatus === 'approved' ? styles.statusApproved : (user?.verificationStatus === 'pending' ? styles.statusPending : styles.statusNot)
          ]}>
            {(user?.verificationStatus || 'not_submitted').replace('_', ' ').toUpperCase()}
          </Text>
        </View>

        {submitted ? (
          <View style={styles.submittedCard}>
            <Text style={styles.submittedTitle}>✓ Documents Under Review</Text>
            <Text style={styles.submittedDesc}>
              Thank you for submitting your verification details. Our Admin Security Team is reviewing your background check & certifications. Verification usually takes 24-48 hours.
            </Text>
          </View>
        ) : (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Submit Professional Identity Proof</Text>
            <Text style={styles.formSubtitle}>Verify your identity to earn the Fixora Verified Badge and receive up to 3x more bookings.</Text>

            <Text style={styles.label}>Government Issued ID Number / Passport / License:</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. DL-9874563210" 
              value={idNumber} 
              onChangeText={setIdNumber} 
            />

            <Text style={styles.label}>Professional Certification / Skill Accreditation:</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. Certified Home Healthcare Aide / Licensed Master Electrician" 
              value={certName} 
              onChangeText={setCertName} 
            />

            <Text style={styles.label}>Years of Active Industry Experience:</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Years of experience" 
              value={experience} 
              onChangeText={setExperience} 
              keyboardType="numeric" 
            />

            <View style={styles.uploadBox}>
              <Text style={styles.uploadText}>📄 ID Document Attached: [Govt_ID_Scan.pdf]</Text>
              <Text style={styles.uploadText}>📜 Certificate Attached: [Trade_License.png]</Text>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>Submit Verification Request</Text>
            </TouchableOpacity>
          </View>
        )}
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
  statusCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  statusTitle: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
  statusBadge: { fontSize: 12, fontWeight: '800', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  statusApproved: { color: '#10B981', backgroundColor: '#D1FAE5' },
  statusPending: { color: '#F59E0B', backgroundColor: '#FEF3C7' },
  statusNot: { color: '#64748B', backgroundColor: '#F1F5F9' },
  submittedCard: { backgroundColor: '#EFF6FF', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#BFDBFE', alignItems: 'center' },
  submittedTitle: { fontSize: 18, fontWeight: '800', color: '#1E40AF', marginBottom: 8 },
  submittedDesc: { fontSize: 14, color: '#1E3A8A', textAlign: 'center', lineHeight: 20 },
  formCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  formTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  formSubtitle: { fontSize: 13, color: '#64748B', marginTop: 4, marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '700', color: '#475569', marginBottom: 6 },
  input: { backgroundColor: '#F1F5F9', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: '#0F172A', marginBottom: 14 },
  uploadBox: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#CBD5E1', borderStyle: 'dashed', marginBottom: 16 },
  uploadText: { fontSize: 12, color: '#475569', fontWeight: '600', marginBottom: 4 },
  submitBtn: { backgroundColor: '#2563EB', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  submitBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 }
});
