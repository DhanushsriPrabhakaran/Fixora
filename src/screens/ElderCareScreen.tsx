import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { ServiceCard } from '../components/ServiceCard';
import { ProviderCard } from '../components/ProviderCard';

export const ElderCareScreen: React.FC = () => {
  const { services, providers, navigateTo } = useApp();

  const elderServices = services.filter(s => s.categoryType === 'elder_care');
  const elderProviders = providers.filter(p => p.categoryType === 'elder_care');

  const handleEmergencyPress = () => {
    Alert.alert(
      '🚨 Fixora Senior Help Line',
      'Calling 24/7 Priority Elder Support & Emergency Care Dispatcher.\nPhone: +1 (800) 555-CARE',
      [{ text: 'Cancel', style: 'cancel' }, { text: 'Call Now', style: 'default' }]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Elder Care & Support" showBack={true} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroHeaderRow}>
            <Text style={styles.heroIcon}>👵</Text>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>Dignity • Compassion • Safety</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>Trusted Assistance for Your Loved Ones</Text>
          <Text style={styles.heroSub}>
            Compassionate caregivers and companions trained in senior care, mobility assistance, medication routines, and accompaniment.
          </Text>

          {/* Emergency Call Box */}
          <TouchableOpacity 
            style={styles.emergencyBox} 
            onPress={handleEmergencyPress} 
            activeOpacity={0.85}
          >
            <Text style={styles.emergIcon}>📞</Text>
            <View style={styles.emergTextCol}>
              <Text style={styles.emergTitle}>24/7 Senior Emergency Care Line</Text>
              <Text style={styles.emergSub}>Tap for immediate assistance or priority dispatch</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Medical Disclaimer Banner */}
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerIcon}>ℹ️</Text>
          <Text style={styles.disclaimerText}>
            <Text style={styles.boldText}>Medical Disclaimer:</Text> Fixora companion caregivers assist with daily non-medical care and routine reminders. Prescriptions and medical treatments must be performed by licensed medical professionals.
          </Text>
        </View>

        {/* Elder Care Services List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Elder Care Services</Text>
          <Text style={styles.sectionSub}>Select a service tailored to senior wellness and daily living</Text>
          
          <View style={styles.serviceList}>
            {elderServices.map(srv => (
              <ServiceCard 
                key={srv.id} 
                service={srv} 
                onBook={() => navigateTo('BookingFlow', { serviceId: srv.id })}
              />
            ))}
          </View>
        </View>

        {/* Certified Caregivers List */}
        <View style={styles.section}>
          <View style={styles.caregiverHeader}>
            <Text style={styles.sectionTitle}>Verified Elder Caregivers</Text>
            <View style={styles.verifiedCountPill}>
              <Text style={styles.verifiedCountText}>🛡️ Background Checked</Text>
            </View>
          </View>

          {elderProviders.map(prv => (
            <ProviderCard 
              key={prv.id} 
              provider={prv} 
              onBook={() => navigateTo('BookingFlow', { providerId: prv.id })}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  heroBanner: {
    backgroundColor: '#78350F',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  heroIcon: {
    fontSize: 32,
    marginRight: 10,
  },
  heroBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 13,
    color: '#FDE68A',
    lineHeight: 19,
    marginBottom: 16,
  },
  emergencyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    padding: 12,
    borderRadius: 12,
    elevation: 3,
  },
  emergIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  emergTextCol: {
    flex: 1,
  },
  emergTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  emergSub: {
    color: '#FEE2E2',
    fontSize: 11,
  },
  disclaimerBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    margin: 16,
    borderRadius: 12,
    padding: 12,
    alignItems: 'flex-start',
  },
  disclaimerIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: '#1E40AF',
    lineHeight: 17,
  },
  boldText: {
    fontWeight: '800',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  sectionSub: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 14,
  },
  serviceList: {
    gap: 4,
  },
  caregiverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  verifiedCountPill: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedCountText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065F46',
  },
});
