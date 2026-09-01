import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Category } from '../types';
import { useApp } from '../context/AppContext';

interface CategoryCardProps {
  category: Category;
  onPress?: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  const { navigateTo } = useApp();

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    if (category.type === 'elder_care') {
      navigateTo('ElderCare');
    } else if (category.type === 'child_care') {
      navigateTo('ChildCare');
    } else {
      navigateTo('CategoryDetail', { categoryId: category.id, categoryName: category.name });
    }
  };

  const isElder = category.type === 'elder_care';
  const isChild = category.type === 'child_care';

  const cardBg = isElder ? '#FFFBEB' : isChild ? '#FDF2F8' : '#F0F9FF';
  const borderColor = isElder ? '#FDE68A' : isChild ? '#FBCFE8' : '#BAE6FD';

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: cardBg, borderColor }]}
      activeOpacity={0.8}
      onPress={handlePress}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{category.icon}</Text>
      </View>

      <Text style={styles.name} numberOfLines={1}>
        {category.name}
      </Text>

      <Text style={styles.countText}>{category.itemCount} options</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 100,
    borderRadius: 14,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginBottom: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    elevation: 1,
  },
  icon: {
    fontSize: 22,
  },
  name: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 2,
  },
  countText: {
    fontSize: 10,
    color: '#6B7280',
  },
});
