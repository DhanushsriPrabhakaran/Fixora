import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const LoginScreen: React.FC = () => {
  const { login, navigateTo } = useApp();
  const [email, setEmail] = useState('dhanush@example.com');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      setErrorMsg('Please enter both email/phone and password.');
      return;
    }
    setErrorMsg('');
    login(email, selectedRole);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoIcon}>🛡️</Text>
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Log in to access trusted home & family care services</Text>
        </View>

        {/* Role Selector */}
        <View style={styles.roleContainer}>
          <Text style={styles.roleLabel}>Select Account Type:</Text>
          <View style={styles.roleToggle}>
            <TouchableOpacity
              style={[styles.roleBtn, selectedRole === 'customer' && styles.activeRoleBtn]}
              onPress={() => setSelectedRole('customer')}
              activeOpacity={0.8}
            >
              <Text style={[styles.roleBtnText, selectedRole === 'customer' && styles.activeRoleBtnText]}>
                👨‍👩‍👧 Customer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleBtn, selectedRole === 'provider' && styles.activeRoleBtn]}
              onPress={() => setSelectedRole('provider')}
              activeOpacity={0.8}
            >
              <Text style={[styles.roleBtnText, selectedRole === 'provider' && styles.activeRoleBtnText]}>
                🛠️ Provider
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleBtn, selectedRole === 'admin' && styles.activeRoleBtn]}
              onPress={() => setSelectedRole('admin')}
              activeOpacity={0.8}
            >
              <Text style={[styles.roleBtnText, selectedRole === 'admin' && styles.activeRoleBtnText]}>
                🛡️ Admin
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

        {/* Inputs */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email or Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. dhanush@example.com"
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

          <TouchableOpacity style={styles.forgotBtn} activeOpacity={0.7}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.85}>
            <Text style={styles.loginBtnText}>
              Log In as {selectedRole === 'customer' ? 'Customer' : 'Provider'}
            </Text>
          </TouchableOpacity>

          {/* Demo Quick Fill */}
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Quick Demo Sign-In:</Text>
            <View style={styles.demoBtns}>
              <TouchableOpacity
                style={styles.demoBtn}
                onPress={() => {
                  setEmail('dhanush@example.com');
                  setSelectedRole('customer');
                  login('dhanush@example.com', 'customer');
                }}
              >
                <Text style={styles.demoBtnText}>Customer Demo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.demoBtnProvider}
                onPress={() => {
                  setEmail('elena@fixora.care');
                  setSelectedRole('provider');
                  login('elena@fixora.care', 'provider');
                }}
              >
                <Text style={styles.demoBtnTextProvider}>Provider Demo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Create Account link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigateTo('Register')}>
            <Text style={styles.registerLink}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoIcon: {
    fontSize: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  roleContainer: {
    marginBottom: 20,
  },
  roleLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  roleToggle: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    padding: 4,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeRoleBtn: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  roleBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  activeRoleBtnText: {
    color: '#1E40AF',
    fontWeight: '700',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 18,
  },
  forgotText: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '600',
  },
  loginBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  demoBox: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 14,
  },
  demoTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  demoBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  demoBtn: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  demoBtnText: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '700',
  },
  demoBtnProvider: {
    flex: 1,
    backgroundColor: '#ECFDF5',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  demoBtnTextProvider: {
    color: '#047857',
    fontSize: 12,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    color: '#4B5563',
    fontSize: 14,
  },
  registerLink: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
  },
});
