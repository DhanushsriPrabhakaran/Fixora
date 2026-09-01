import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { useApp } from '../context/AppContext';
import { ServiceCard } from '../components/ServiceCard';
import { ProviderCard } from '../components/ProviderCard';

export const FavouritesScreen: React.FC = () => {
  const { 
    services, 
    providers, 
    favouriteServiceIds, 
    favouriteProviderIds, 
    navigateTo 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'providers' | 'services'>('providers');

  const favProviders = providers.filter(p => favouriteProviderIds.includes(p.id));
  const favServices = services.filter(s => favouriteServiceIds.includes(s.id));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Favourites</Text>

        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'providers' && styles.activeTabBtn]}
            onPress={() => setActiveTab('providers')}
          >
            <Text style={[styles.tabText, activeTab === 'providers' && styles.activeTabText]}>
              Providers ({favProviders.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'services' && styles.activeTabBtn]}
            onPress={() => setActiveTab('services')}
          >
            <Text style={[styles.tabText, activeTab === 'services' && styles.activeTabText]}>
              Services ({favServices.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'providers' ? (
          favProviders.length > 0 ? (
            favProviders.map(p => (
              <ProviderCard 
                key={p.id} 
                provider={p} 
                onBook={() => navigateTo('BookingFlow', { providerId: p.id })}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>❤️</Text>
              <Text style={styles.emptyTitle}>No Saved Providers</Text>
              <Text style={styles.emptySub}>
                Tap the heart icon on any provider profile to save them for quick access!
              </Text>
            </View>
          )
        ) : (
          favServices.length > 0 ? (
            favServices.map(s => (
              <ServiceCard 
                key={s.id} 
                service={s} 
                onBook={() => navigateTo('BookingFlow', { serviceId: s.id })}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🤍</Text>
              <Text style={styles.emptyTitle}>No Saved Services</Text>
              <Text style={styles.emptySub}>
                Save your frequently booked home and family care services here!
              </Text>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 14,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    padding: 3,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabBtn: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  activeTabText: {
    color: '#1E40AF',
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 18,
  },
});
