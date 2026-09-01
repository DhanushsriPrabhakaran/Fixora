import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useApp } from '../context/AppContext';

export const AdminDashboardScreen: React.FC = () => {
  const { providers, bookings, complaints, resolveComplaint, verifyProvider, navigateTo, switchRole } = useApp();
  const [activeTab, setActiveTab] = useState<'analytics' | 'providers' | 'complaints'>('analytics');

  const pendingProviders = providers.filter(p => !p.verified);
  const totalRevenue = bookings.filter(b => b.status === 'completed').reduce((acc, b) => acc + b.totalAmount, 0);

  const handleApproveProvider = (id: string, name: string) => {
    verifyProvider(id, true);
    Alert.alert('Success', `Provider ${name} verified successfully!`);
  };

  const handleRejectProvider = (id: string, name: string) => {
    verifyProvider(id, false);
    Alert.alert('Updated', `Provider ${name} verification declined.`);
  };

  const handleResolveComplaint = (id: string) => {
    resolveComplaint(id, 'resolved', 'Issue resolved by Platform Admin.');
    Alert.alert('Resolved', 'Complaint ticket marked as resolved.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fixora Admin Center</Text>
        <TouchableOpacity style={styles.roleBtn} onPress={() => switchRole('customer')}>
          <Text style={styles.roleBtnText}>Switch to User View</Text>
        </TouchableOpacity>
      </View>

      {/* Admin Nav Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'analytics' && styles.activeTabItem]} 
          onPress={() => setActiveTab('analytics')}
        >
          <Text style={[styles.tabText, activeTab === 'analytics' && styles.activeTabText]}>Analytics</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'providers' && styles.activeTabItem]} 
          onPress={() => setActiveTab('providers')}
        >
          <Text style={[styles.tabText, activeTab === 'providers' && styles.activeTabText]}>
            KYC Approvals ({pendingProviders.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'complaints' && styles.activeTabItem]} 
          onPress={() => setActiveTab('complaints')}
        >
          <Text style={[styles.tabText, activeTab === 'complaints' && styles.activeTabText]}>
            Complaints ({complaints.filter(c => c.status === 'open').length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'analytics' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Platform Overview</Text>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>${totalRevenue}</Text>
                <Text style={styles.statLabel}>Total Revenue</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{bookings.length}</Text>
                <Text style={styles.statLabel}>Total Bookings</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{providers.length}</Text>
                <Text style={styles.statLabel}>Active Providers</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{providers.filter(p => p.verified).length}</Text>
                <Text style={styles.statLabel}>Verified Badge</Text>
              </View>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Recent Bookings Stream</Text>
            {bookings.slice(0, 4).map(b => (
              <View key={b.id} style={styles.listItem}>
                <View>
                  <Text style={styles.listTitle}>{b.serviceName} ({b.id})</Text>
                  <Text style={styles.listSub}>{b.providerName} • ${b.totalAmount}</Text>
                </View>
                <Text style={styles.statusBadge}>{b.status.replace('_', ' ')}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'providers' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Provider Verification Queue</Text>
            {providers.map(p => (
              <View key={p.id} style={styles.providerCard}>
                <Image source={{ uri: p.profileImage }} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.providerName}>{p.name}</Text>
                    {p.verified && <Text style={styles.verifiedTag}>Verified</Text>}
                  </View>
                  <Text style={styles.providerSub}>{p.tagline} • {p.categoryType.replace('_', ' ')}</Text>

                  <View style={styles.actionRow}>
                    {!p.verified ? (
                      <>
                        <TouchableOpacity style={styles.approveBtn} onPress={() => handleApproveProvider(p.id, p.name)}>
                          <Text style={styles.btnText}>Approve Badge</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rejectBtn} onPress={() => handleRejectProvider(p.id, p.name)}>
                          <Text style={styles.rejectBtnText}>Decline</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <TouchableOpacity style={styles.rejectBtn} onPress={() => handleRejectProvider(p.id, p.name)}>
                        <Text style={styles.rejectBtnText}>Revoke Badge</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'complaints' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Complaints & Disputes</Text>
            {complaints.length === 0 ? (
              <Text style={styles.emptyText}>No complaints raised yet.</Text>
            ) : (
              complaints.map(c => (
                <View key={c.id} style={styles.complaintCard}>
                  <View style={styles.complaintHeader}>
                    <Text style={styles.complaintCategory}>{c.category}</Text>
                    <Text style={[styles.complaintStatus, { color: c.status === 'resolved' ? '#10B981' : '#EF4444' }]}>
                      {c.status.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.complaintSubject}>{c.subject}</Text>
                  <Text style={styles.complaintDesc}>{c.description}</Text>
                  <Text style={styles.complaintMeta}>User: {c.userName} • Booking: {c.bookingId}</Text>

                  {c.status === 'open' && (
                    <TouchableOpacity style={styles.resolveBtn} onPress={() => handleResolveComplaint(c.id)}>
                      <Text style={styles.btnText}>Resolve & Issue Refund Credit</Text>
                    </TouchableOpacity>
                  )}
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
  header: { padding: 16, backgroundColor: '#0F172A', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  roleBtn: { backgroundColor: '#334155', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  roleBtnText: { color: '#F8FAFC', fontSize: 12, fontWeight: '600' },
  tabBar: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  tabItem: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  activeTabItem: { borderBottomWidth: 3, borderBottomColor: '#2563EB' },
  tabText: { fontSize: 13, color: '#64748B', fontWeight: '600' },
  activeTabText: { color: '#2563EB', fontWeight: '700' },
  content: { padding: 16 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { width: '48%', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  statNumber: { fontSize: 22, fontWeight: '800', color: '#2563EB' },
  statLabel: { fontSize: 12, color: '#64748B', marginTop: 4 },
  listItem: { backgroundColor: '#FFFFFF', padding: 12, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  listTitle: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
  listSub: { fontSize: 12, color: '#64748B' },
  statusBadge: { fontSize: 11, fontWeight: '700', color: '#2563EB', backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  providerCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 14, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  providerName: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  verifiedTag: { marginLeft: 8, fontSize: 10, fontWeight: '700', color: '#10B981', backgroundColor: '#D1FAE5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  providerSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  actionRow: { flexDirection: 'row', marginTop: 10 },
  approveBtn: { backgroundColor: '#10B981', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, marginRight: 8 },
  rejectBtn: { backgroundColor: '#FEF2F2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#FECACA' },
  btnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  rejectBtnText: { color: '#EF4444', fontSize: 12, fontWeight: '600' },
  complaintCard: { backgroundColor: '#FFFFFF', padding: 14, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  complaintHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  complaintCategory: { fontSize: 12, fontWeight: '700', color: '#2563EB' },
  complaintStatus: { fontSize: 11, fontWeight: '700' },
  complaintSubject: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  complaintDesc: { fontSize: 13, color: '#475569', marginVertical: 6 },
  complaintMeta: { fontSize: 11, color: '#94A3B8' },
  resolveBtn: { marginTop: 10, backgroundColor: '#2563EB', paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  emptyText: { color: '#94A3B8', fontSize: 13, fontStyle: 'italic' }
});
