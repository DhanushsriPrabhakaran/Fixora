import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { ServiceCard } from '../components/ServiceCard';
import { ProviderCard } from '../components/ProviderCard';

export const ChildCareScreen: React.FC = () => {
  const { services, providers, navigateTo } = useApp();

  const childServices = services.filter(s => s.categoryType === 'child_care');
  const childProviders = providers.filter(p => p.categoryType === 'child_care');

  return (
    <View style={styles.container}>
      <Header title="Child Care & Babysitting" showBack={true} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroBadgeRow}>
            <Text style={styles.heroIcon}>👶</Text>
            <View style={styles.badgePill}>
              <Text style={styles.badgeText}>Safe • Verified • Loving</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>Safe & Trusted Child Care</Text>
          <Text style={styles.heroSub}>
            Reliable caregivers, infant specialists, school pickup assistants, and tutors for your little ones.
          </Text>

          <View style={styles.tagsRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>🛡️ 100% Background Checked</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>🫀 Infant CPR Trained</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>📚 Educational Play</Text>
            </View>
          </View>
        </View>

        {/* Safety Guarantee Box */}
        <View style={styles.safetyBox}>
          <View style={styles.safetyHeader}>
            <Text style={styles.shieldIcon}>🛡️</Text>
            <Text style={styles.safetyTitle}>Fixora Child Safety Commitment</Text>
          </View>
          <Text style={styles.safetyDesc}>
            Every child caregiver undergoes criminal background verification, identity check, reference verification, and CPR safety screening before listing on Fixora.
          </Text>
        </View>

        {/* Child Care Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Child Care Services</Text>
          <Text style={styles.sectionSub}>Customized care from infants to school-age children</Text>

          <View style={styles.serviceList}>
            {childServices.map(srv => (
              <ServiceCard 
                key={srv.id} 
                service={srv} 
                onBook={() => navigateTo('BookingFlow', { serviceId: srv.id })}
              />
            ))}
          </View>
        </View>

        {/* Verified Babysitters & Caregivers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verified Caregivers</Text>
          <Text style={styles.sectionSub}>Browse background-verified babysitters & specialists</Text>

          {childProviders.map(prv => (
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
    backgroundColor: '#FDF2F8',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  heroBanner: {
    backgroundColor: '#831843',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroIcon: {
    fontSize: 32,
    marginRight: 10,
  },
  badgePill: {
    backgroundColor: '#FCE7F3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9D174D',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 13,
    color: '#FBCFE8',
    lineHeight: 19,
    marginBottom: 14,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  safetyBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F9A8D4',
    margin: 16,
    borderRadius: 14,
    padding: 14,
    elevation: 2,
  },
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  shieldIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  safetyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#9D174D',
  },
  safetyDesc: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 17,
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
});
