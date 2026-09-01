import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showLocation?: boolean;
  showNotification?: boolean;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  showLocation = false,
  showNotification = true,
  rightAction,
}) => {
  const { user, goBack, navigateTo, notifications } = useApp();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftRow}>
        {showBack ? (
          <TouchableOpacity style={styles.backBtn} onPress={goBack} activeOpacity={0.7}>
            <Text style={styles.backBtnIcon}>‹</Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.titleCol}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
          {showLocation && user?.address ? (
            <TouchableOpacity style={styles.locationRow} activeOpacity={0.7}>
              <Text style={styles.locationPin}>📍</Text>
              <Text style={styles.locationText} numberOfLines={1}>
                {user.address}
              </Text>
              <Text style={styles.caret}>▾</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={styles.rightRow}>
        {rightAction}

        {showNotification ? (
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => navigateTo('Notifications')}
            activeOpacity={0.7}
          >
            <Text style={styles.notifIcon}>🔔</Text>
            {unreadCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  backBtnIcon: {
    fontSize: 24,
    color: '#1F2937',
    fontWeight: 'bold',
    marginTop: -2,
  },
  titleCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationPin: {
    fontSize: 12,
    marginRight: 3,
  },
  locationText: {
    fontSize: 12,
    color: '#4B5563',
    maxWidth: 200,
    fontWeight: '500',
  },
  caret: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 3,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    position: 'relative',
  },
  notifIcon: {
    fontSize: 18,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
