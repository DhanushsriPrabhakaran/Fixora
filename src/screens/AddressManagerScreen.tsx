import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useApp } from '../context/AppContext';

export const AddressManagerScreen: React.FC = () => {
  const { addresses, selectedAddressId, addAddress, deleteAddress, setDefaultAddress, goBack } = useApp();

  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('New York Metro');
  const [zipCode, setZipCode] = useState('');
  const [landmark, setLandmark] = useState('');

  const handleSaveAddress = () => {
    if (!title || !name || !phone || !street || !area || !zipCode) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }
    addAddress({ title, name, phone, street, area, city, zipCode, landmark });
    Alert.alert('Success', 'Address added successfully!');
    setShowAddForm(false);
    setTitle(''); setName(''); setPhone(''); setStreet(''); setArea(''); setZipCode(''); setLandmark('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Saved Addresses</Text>
        <TouchableOpacity onPress={() => setShowAddForm(!showAddForm)}>
          <Text style={styles.addText}>{showAddForm ? 'Cancel' : '+ Add New'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {showAddForm ? (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Add New Service Address</Text>
            
            <TextInput style={styles.input} placeholder="Label (e.g. Home, Work, Parent's Place)" value={title} onChangeText={setTitle} />
            <TextInput style={styles.input} placeholder="Recipient / Contact Name" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Contact Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <TextInput style={styles.input} placeholder="Street Address / House No." value={street} onChangeText={setStreet} />
            <TextInput style={styles.input} placeholder="Area / Building / Suite" value={area} onChangeText={setArea} />
            <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />
            <TextInput style={styles.input} placeholder="PIN / Zip Code" value={zipCode} onChangeText={setZipCode} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Landmark (Optional)" value={landmark} onChangeText={setLandmark} />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveAddress}>
              <Text style={styles.saveBtnText}>Save Address</Text>
            </TouchableOpacity>
          </View>
        ) : (
          addresses.map(addr => {
            const isSelected = selectedAddressId === addr.id;
            return (
              <View key={addr.id} style={[styles.addressCard, isSelected && styles.selectedCard]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{addr.title}</Text>
                  {addr.isDefault && <Text style={styles.defaultBadge}>DEFAULT</Text>}
                </View>

                <Text style={styles.addrName}>{addr.name} ({addr.phone})</Text>
                <Text style={styles.addrBody}>{addr.street}, {addr.area}</Text>
                <Text style={styles.addrBody}>{addr.city} - {addr.zipCode}</Text>

                <View style={styles.cardActions}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => setDefaultAddress(addr.id)}>
                    <Text style={styles.actionBtnText}>{addr.isDefault ? '✓ Active Default' : 'Set as Default'}</Text>
                  </TouchableOpacity>

                  {!addr.isDefault && (
                    <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteAddress(addr.id)}>
                      <Text style={styles.deleteBtnText}>Delete</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
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
  formCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  formTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 14 },
  input: { backgroundColor: '#F1F5F9', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: '#0F172A', marginBottom: 12 },
  saveBtn: { backgroundColor: '#2563EB', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 6 },
  saveBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  addressCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  selectedCard: { borderColor: '#2563EB', borderWidth: 2, backgroundColor: '#EFF6FF' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  defaultBadge: { fontSize: 10, fontWeight: '800', color: '#10B981', backgroundColor: '#D1FAE5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  addrName: { fontSize: 14, fontWeight: '600', color: '#334155', marginTop: 4 },
  addrBody: { fontSize: 13, color: '#64748B', marginTop: 2 },
  cardActions: { flexDirection: 'row', marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  actionBtn: { marginRight: 12 },
  actionBtnText: { fontSize: 13, fontWeight: '700', color: '#2563EB' },
  deleteBtn: { marginLeft: 'auto' },
  deleteBtnText: { fontSize: 13, fontWeight: '600', color: '#EF4444' }
});
