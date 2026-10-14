import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Modal
} from 'react-native';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const LoginScreen: React.FC = () => {
  const { login, navigateTo, resetPassword } = useApp();
  const [email, setEmail] = useState('dhanush@example.com');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password Modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const portalConfig = {
    customer: {
      title: 'Customer Portal',
      subtitle: 'Book Home Services, Elder Care & Babysitting',
      badgeIcon: '👨‍👩‍👧',
      accentColor: '#2563EB',
      badgeBg: '#DBEAFE',
      defaultEmail: 'dhanush@example.com',
      defaultPassword: 'password123',
      placeholder: 'e.g. customer@example.com',
      demoText: 'Log In as Customer Demo',
    },
    provider: {
      title: 'Service Provider Portal',
      subtitle: 'Manage Jobs, Accept Requests & Track Earnings',
      badgeIcon: '🛠️',
      accentColor: '#059669',
      badgeBg: '#D1FAE5',
      defaultEmail: 'elena@fixora.care',
      defaultPassword: 'password123',
      placeholder: 'e.g. provider@fixora.care',
      demoText: 'Log In as Provider Demo',
    },
    admin: {
      title: 'Platform Admin Console',
      subtitle: 'Verify Providers, Resolve Complaints & Platform Settings',
      badgeIcon: '🛡️',
      accentColor: '#7C3AED',
      badgeBg: '#EDE9FE',
      defaultEmail: 'admin@fixora.care',
      defaultPassword: 'adminpassword123',
      placeholder: 'e.g. admin@fixora.care',
      demoText: 'Log In as Admin Console',
    },
  };

  const activePortal = portalConfig[selectedRole];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(portalConfig[role].defaultEmail);
    setPassword(portalConfig[role].defaultPassword);
    setErrorMsg('');
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg('Please enter your email/phone and password.');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      await login(email, selectedRole, password);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForgotModal = () => {
    setResetEmail(email || activePortal.defaultEmail);
    setNewPassword('');
    setConfirmNewPassword('');
    setModalError('');
    setModalSuccess('');
    setShowForgotModal(true);
  };

  const handleResetPasswordSubmit = async () => {
    if (!resetEmail || !newPassword || !confirmNewPassword) {
      setModalError('Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setModalError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setModalError('New password must be at least 6 characters long.');
      return;
    }

    setModalError('');
    setModalSuccess('');
    setResetLoading(true);
    try {
      const msg = await resetPassword(resetEmail, newPassword);
      setModalSuccess(msg);
      setEmail(resetEmail);
      setPassword(newPassword);
      setTimeout(() => {
        setShowForgotModal(false);
      }, 1800);
    } catch (err: any) {
      setModalError(err.message || 'Failed to reset password.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        {/* App Title Banner */}
        <View style={styles.appBanner}>
          <Text style={styles.appLogoText}>Fixora</Text>
          <Text style={styles.appTagline}>On-Demand Home Services & Care Platform</Text>
        </View>

        {/* Portal Switcher Tabs */}
        <View style={styles.portalTabsContainer}>
          <Text style={styles.portalTabsLabel}>Choose Portal Access:</Text>
          <View style={styles.portalTabsRow}>
            <TouchableOpacity
              style={[
                styles.portalTab,
                selectedRole === 'customer' && { backgroundColor: '#2563EB' }
              ]}
              onPress={() => handleRoleSelect('customer')}
              activeOpacity={0.8}
            >
              <Text style={styles.portalTabIcon}>👨‍👩‍👧</Text>
              <Text style={[
                styles.portalTabText,
                selectedRole === 'customer' && styles.activePortalTabText
              ]}>Customer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.portalTab,
                selectedRole === 'provider' && { backgroundColor: '#059669' }
              ]}
              onPress={() => handleRoleSelect('provider')}
              activeOpacity={0.8}
            >
              <Text style={styles.portalTabIcon}>🛠️</Text>
              <Text style={[
                styles.portalTabText,
                selectedRole === 'provider' && styles.activePortalTabText
              ]}>Provider</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.portalTab,
                selectedRole === 'admin' && { backgroundColor: '#7C3AED' }
              ]}
              onPress={() => handleRoleSelect('admin')}
              activeOpacity={0.8}
            >
              <Text style={styles.portalTabIcon}>🛡️</Text>
              <Text style={[
                styles.portalTabText,
                selectedRole === 'admin' && styles.activePortalTabText
              ]}>Admin</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Active Portal Header Box */}
        <View style={[styles.portalHeaderBox, { borderLeftColor: activePortal.accentColor }]}>
          <View style={[styles.portalBadge, { backgroundColor: activePortal.badgeBg }]}>
            <Text style={styles.portalBadgeIcon}>{activePortal.badgeIcon}</Text>
          </View>
          <View style={styles.portalHeaderTexts}>
            <Text style={[styles.portalTitle, { color: activePortal.accentColor }]}>
              {activePortal.title}
            </Text>
            <Text style={styles.portalSubtitle}>{activePortal.subtitle}</Text>
          </View>
        </View>

        {errorMsg ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        {/* Login Form */}
        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              {selectedRole === 'provider' ? 'Provider Email / Phone' : (selectedRole === 'admin' ? 'Admin Username' : 'Email or Phone')}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={activePortal.placeholder}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.forgotBtn} onPress={handleOpenForgotModal} activeOpacity={0.7}>
            <Text style={{ color: activePortal.accentColor, fontWeight: '600', fontSize: 13 }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginBtn, { backgroundColor: activePortal.accentColor }]} 
            onPress={handleLogin} 
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.loginBtnText}>
                Log In to {activePortal.title.replace(' Access', '')}
              </Text>
            )}
          </TouchableOpacity>

          {/* Quick Demo Sign-in Box */}
          <View style={styles.demoSection}>
            <Text style={styles.demoSectionTitle}>⚡ Quick Demo Credentials:</Text>
            <TouchableOpacity 
              style={[styles.demoQuickBtn, { borderColor: activePortal.accentColor }]}
              onPress={async () => {
                const demoEmail = activePortal.defaultEmail;
                const demoPass = activePortal.defaultPassword;
                setEmail(demoEmail);
                setPassword(demoPass);
                setErrorMsg('');
                setLoading(true);
                try {
                  await login(demoEmail, selectedRole, demoPass);
                } catch (err: any) {
                  setErrorMsg(err.message || 'Login failed.');
                } finally {
                  setLoading(false);
                }
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.demoQuickBtnText, { color: activePortal.accentColor }]}>
                {activePortal.demoText} ({activePortal.defaultEmail})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Registration Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Need a new account?</Text>
          <TouchableOpacity onPress={() => navigateTo('Register', { role: selectedRole })}>
            <Text style={[styles.registerLink, { color: activePortal.accentColor }]}>
              Register as {selectedRole === 'provider' ? 'Service Provider' : (selectedRole === 'admin' ? 'Admin' : 'Customer')}
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Forgot Password Reset Modal */}
      <Modal
        visible={showForgotModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowForgotModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🔐 Reset Account Password</Text>
              <TouchableOpacity onPress={() => setShowForgotModal(false)}>
                <Text style={styles.modalCloseIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Enter your registered account email and set your new password below.
            </Text>

            {modalError ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {modalError}</Text>
              </View>
            ) : null}

            {modalSuccess ? (
              <View style={styles.successBox}>
                <Text style={styles.successText}>✅ {modalSuccess}</Text>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Registered Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. user@example.com"
                value={resetEmail}
                onChangeText={setResetEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Re-enter new password"
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelModalBtn}
                onPress={() => setShowForgotModal(false)}
              >
                <Text style={styles.cancelModalBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.saveModalBtn, { backgroundColor: activePortal.accentColor }]}
                onPress={handleResetPasswordSubmit}
                disabled={resetLoading}
              >
                {resetLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.saveModalBtnText}>Update Password</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 45,
  },
  appBanner: {
    alignItems: 'center',
    marginBottom: 20,
  },
  appLogoText: {
    fontSize: 30,
    fontWeight: '900',
    color: '#1E3A8A',
    letterSpacing: 0.5,
  },
  appTagline: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 2,
  },
  portalTabsContainer: {
    marginBottom: 16,
  },
  portalTabsLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  portalTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  portalTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  portalTabIcon: {
    fontSize: 15,
  },
  portalTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  activePortalTabText: {
    color: '#FFFFFF',
  },
  portalHeaderBox: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 5,
    elevation: 2,
    alignItems: 'center',
    marginBottom: 16,
  },
  portalBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  portalBadgeIcon: {
    fontSize: 22,
  },
  portalHeaderTexts: {
    flex: 1,
  },
  portalTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  portalSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  errorText: {
    fontSize: 12,
    color: '#991B1B',
    fontWeight: '600',
    flex: 1,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 3,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#111827',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 18,
  },
  loginBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  demoSection: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 14,
  },
  demoSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  demoQuickBtn: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  demoQuickBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  footer: {
    alignItems: 'center',
    gap: 4,
    paddingBottom: 20,
  },
  footerText: {
    color: '#6B7280',
    fontSize: 13,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  modalCloseIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B7280',
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 16,
  },
  successBox: {
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: '#6EE7B7',
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
  },
  successText: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '700',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  cancelModalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelModalBtnText: {
    color: '#4B5563',
    fontWeight: '700',
    fontSize: 14,
  },
  saveModalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveModalBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});

