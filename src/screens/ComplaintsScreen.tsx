import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useApp } from '../context/AppContext';

export const ComplaintsScreen: React.FC = () => {
  const { complaints, bookings, addComplaint, goBack } = useApp();

  const [showForm, setShowForm] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(bookings[0]?.id || 'FIX-1001');
  const [category, setCategory] = useState('Service Quality');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!subject.trim() || !description.trim()) {
      Alert.alert('Incomplete Form', 'Please provide a subject and description for your ticket.');
      return;
    }
    addComplaint(selectedBookingId, category, subject, description);
    Alert.alert('Complaint Submitted', 'Your ticket has been sent to Fixora Support for review.');
    setShowForm(false);
    setSubject('');
    setDescription('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support Disputes</Text>
        <TouchableOpacity onPress={() => setShowForm(!showForm)}>
          <Text style={styles.addText}>{showForm ? 'Close' : '+ Raise Ticket'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {showForm ? (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Raise a Dispute Ticket</Text>

            <Text style={styles.label}>Select Booking:</Text>
            <View style={styles.bookingRow}>
              {bookings.map(b => (
                <TouchableOpacity 
                  key={b.id} 
                  style={[styles.bookingChip, selectedBookingId === b.id && styles.activeChip]}
                  onPress={() => setSelectedBookingId(b.id)}
                >
                  <Text style={[styles.chipText, selectedBookingId === b.id && styles.activeChipText]}>{b.id}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Issue Category:</Text>
            <View style={styles.bookingRow}>
              {['Service Quality', 'Late Arrival', 'Billing/Payment', 'Conduct'].map(cat => (
                <TouchableOpacity 
                  key={cat} 
                  style={[styles.bookingChip, category === cat && styles.activeChip]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.chipText, category === cat && styles.activeChipText]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput style={styles.input} placeholder="Brief Subject" value={subject} onChangeText={setSubject} />
            <TextInput 
              style={[styles.input, { height: 90, textAlignVertical: 'top' }]} 
              placeholder="Detailed explanation of the issue..." 
              value={description} 
              onChangeText={setDescription}
              multiline
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>Submit Complaint Ticket</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={styles.sectionTitle}>Your Support Tickets</Text>
            {complaints.length === 0 ? (
              <Text style={styles.emptyText}>No dispute tickets raised.</Text>
            ) : (
              complaints.map(c => (
                <View key={c.id} style={styles.complaintCard}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.complaintCategory}>{c.category}</Text>
                    <Text style={[styles.statusBadge, { color: c.status === 'resolved' ? '#10B981' : '#EF4444' }]}>
                      {c.status.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.complaintSubject}>{c.subject}</Text>
                  <Text style={styles.complaintDesc}>{c.description}</Text>
                  <Text style={styles.metaText}>Ticket ID: {c.id} • Booking: {c.bookingId} • {c.createdAt}</Text>

                  {c.adminResolution ? (
                    <View style={styles.resolutionBox}>
                      <Text style={styles.resolutionTitle}>Admin Resolution:</Text>
                      <Text style={styles.resolutionText}>{c.adminResolution}</Text>
                    </View>
                  ) : null}
                </View>
              ))
            )}
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
  addText: { fontSize: 14, fontWeight: '700', color: '#2563EB' },
  content: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  formCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  formTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '700', color: '#475569', marginTop: 6, marginBottom: 4 },
  bookingRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  bookingChip: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, marginRight: 6, marginBottom: 6 },
  activeChip: { backgroundColor: '#2563EB' },
  chipText: { fontSize: 12, color: '#334155', fontWeight: '600' },
  activeChipText: { color: '#FFFFFF' },
  input: { backgroundColor: '#F1F5F9', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: '#0F172A', marginBottom: 12 },
  submitBtn: { backgroundColor: '#2563EB', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 6 },
  submitBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  complaintCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  complaintCategory: { fontSize: 12, fontWeight: '700', color: '#2563EB' },
  statusBadge: { fontSize: 11, fontWeight: '700' },
  complaintSubject: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  complaintDesc: { fontSize: 13, color: '#475569', marginVertical: 6 },
  metaText: { fontSize: 11, color: '#94A3B8' },
  resolutionBox: { marginTop: 10, padding: 10, backgroundColor: '#F0FDF4', borderRadius: 6, borderWidth: 1, borderColor: '#BBF7D0' },
  resolutionTitle: { fontSize: 12, fontWeight: '700', color: '#166534' },
  resolutionText: { fontSize: 12, color: '#15803D', marginTop: 2 },
  emptyText: { color: '#94A3B8', fontSize: 13, fontStyle: 'italic' }
});
