import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';

export const SplashScreen: React.FC = () => {
  const { user, navigateTo } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        navigateTo('MainTab');
      } else {
        navigateTo('Login');
      }
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoIcon}>🛡️</Text>
        </View>

        <Text style={styles.appName}>Fixora</Text>
        <Text style={styles.tagline}>
          Trusted Services. Caring People.{'\n'}Better Homes.
        </Text>

        <View style={styles.featurePills}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>🔧 Home Repairs</Text>
          </View>
          <View style={styles.pillElder}>
            <Text style={styles.pillTextElder}>👵 Elder Care</Text>
          </View>
          <View style={styles.pillChild}>
            <Text style={styles.pillTextChild}>👶 Child Care</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.getStartedBtn}
        onPress={() => navigateTo(user ? 'MainTab' : 'Login')}
        activeOpacity={0.8}
      >
        <Text style={styles.getStartedText}>Get Started →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E3A8A',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    marginTop: 80,
  },
  logoBadge: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoIcon: {
    fontSize: 44,
  },
  appName: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#93C5FD',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
    marginBottom: 30,
  },
  featurePills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  pill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  pillElder: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pillTextElder: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '700',
  },
  pillChild: {
    backgroundColor: '#FCE7F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pillTextChild: {
    color: '#9D174D',
    fontSize: 12,
    fontWeight: '700',
  },
  getStartedBtn: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 4,
    width: '100%',
    alignItems: 'center',
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
