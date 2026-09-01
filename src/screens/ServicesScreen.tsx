import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity 
} from 'react-native';
import { useApp } from '../context/AppContext';
import { ServiceCard } from '../components/ServiceCard';
import { ProviderCard } from '../components/ProviderCard';
import { ServiceCategoryType } from '../types';

export const ServicesScreen: React.FC = () => {
  const { services, providers, filterOptions, setFilterOptions, navigateTo } = useApp();
  const [activeTab, setActiveTab] = useState<'services' | 'providers'>('services');
  const [selectedCatType, setSelectedCatType] = useState<ServiceCategoryType | 'all'>(
    filterOptions.categoryType || 'all'
  );

  const categories: { id: ServiceCategoryType | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'All Services', icon: '✨' },
    { id: 'home', label: 'Home Repairs', icon: '🔧' },
    { id: 'elder_care', label: 'Elderly Care', icon: '👵' },
    { id: 'child_care', label: 'Child Care', icon: '👶' },
  ];

  const filteredServices = services.filter(srv => {
    if (selectedCatType !== 'all' && srv.categoryType !== selectedCatType) return false;
    if (filterOptions.searchQuery) {
      const q = filterOptions.searchQuery.toLowerCase();
      const matchName = srv.name.toLowerCase().includes(q);
      const matchCat = srv.category.toLowerCase().includes(q);
      const matchDesc = srv.description.toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchDesc) return false;
    }
    return true;
  });

  const filteredProviders = providers.filter(prv => {
    if (selectedCatType !== 'all' && prv.categoryType !== selectedCatType) return false;
    if (filterOptions.verifiedOnly && !prv.verified) return false;
    if (filterOptions.minRating && prv.rating < filterOptions.minRating) return false;
    if (filterOptions.searchQuery) {
      const q = filterOptions.searchQuery.toLowerCase();
      const matchName = prv.name.toLowerCase().includes(q);
      const matchTag = prv.tagline.toLowerCase().includes(q);
      if (!matchName && !matchTag) return false;
    }
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search plumber, cleaning, elder care..."
            placeholderTextColor="#9CA3AF"
            value={filterOptions.searchQuery}
            onChangeText={(txt) => setFilterOptions(prev => ({ ...prev, searchQuery: txt }))}
          />
          {filterOptions.searchQuery ? (
            <TouchableOpacity onPress={() => setFilterOptions(prev => ({ ...prev, searchQuery: '' }))}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Category Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
          {categories.map(cat => {
            const isSelected = selectedCatType === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catPill, isSelected && styles.activeCatPill]}
                onPress={() => setSelectedCatType(cat.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.catIcon}>{cat.icon}</Text>
                <Text style={[styles.catLabel, isSelected && styles.activeCatLabel]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* View Toggle: Services vs Providers */}
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, activeTab === 'services' && styles.activeToggleBtn]}
            onPress={() => setActiveTab('services')}
          >
            <Text style={[styles.toggleText, activeTab === 'services' && styles.activeToggleText]}>
              Services ({filteredServices.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleBtn, activeTab === 'providers' && styles.activeToggleBtn]}
            onPress={() => setActiveTab('providers')}
          >
            <Text style={[styles.toggleText, activeTab === 'providers' && styles.activeToggleText]}>
              Providers ({filteredProviders.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main List */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {activeTab === 'services' ? (
          filteredServices.length > 0 ? (
            filteredServices.map(srv => (
              <ServiceCard 
                key={srv.id} 
                service={srv} 
                onBook={() => navigateTo('BookingFlow', { serviceId: srv.id })}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>No Services Found</Text>
              <Text style={styles.emptySub}>Try adjusting your search query or category filters.</Text>
            </View>
          )
        ) : (
          filteredProviders.length > 0 ? (
            filteredProviders.map(prv => (
              <ProviderCard 
                key={prv.id} 
                provider={prv} 
                onBook={() => navigateTo('BookingFlow', { providerId: prv.id })}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>👤</Text>
              <Text style={styles.emptyTitle}>No Providers Found</Text>
              <Text style={styles.emptySub}>No verified providers match your current filter options.</Text>
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
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 10,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  clearIcon: {
    fontSize: 14,
    color: '#9CA3AF',
    paddingHorizontal: 6,
  },
  catRow: {
    paddingBottom: 8,
    gap: 8,
  },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  activeCatPill: {
    backgroundColor: '#1E40AF',
  },
  catIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  catLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  activeCatLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    padding: 3,
    marginTop: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeToggleBtn: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  activeToggleText: {
    color: '#1E40AF',
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
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
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 260,
  },
});
