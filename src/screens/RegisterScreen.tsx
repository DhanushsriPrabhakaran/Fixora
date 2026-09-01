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

export const RegisterScreen: React.FC = () => {
  const { register, navigateTo } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = () => {
    if (!name || !email || !phone || !password || !address) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    setErrorMsg('');
    register({ name, email, phone, address, role });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigateTo('Login')}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Fixora for trusted home and family care</Text>
        </View>

        {/* Role Selection */}
        <View style={styles.roleContainer}>
          <Text style={styles.roleLabel}>I am registering as a:</Text>
          <View style={styles.roleToggle}>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'customer' && styles.activeRoleBtn]}
              onPress={() => setRole('customer')}
            >
              <Text style={[styles.roleBtnText, role === 'customer' && styles.activeRoleBtnText]}>
                👨‍👩‍👧 Customer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleBtn, role === 'provider' && styles.activeRoleBtn]}
              onPress={() => setRole('provider')}
            >
              <Text style={[styles.roleBtnText, role === 'provider' && styles.activeRoleBtnText]}>
                🛠️ Service Provider
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Dhanush"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address *</Text>
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
            <Text style={styles.inputLabel}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Primary Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="Street address, city, zip"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password *</Text>
            <TextInput
              style={styles.input}
              placeholder="At least 6 characters"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm Password *</Text>
            <TextInput
              style={styles.input}
              placeholder="Re-enter password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} activeOpacity={0.85}>
            <Text style={styles.registerBtnText}>
              Register as {role === 'customer' ? 'Customer' : 'Service Provider'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigateTo('Login')}>
            <Text style={styles.loginLink}>Log In</Text>
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
    paddingTop: 40,
  },
  header: {
    marginBottom: 20,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  backIcon: {
    fontSize: 24,
    color: '#111827',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  roleContainer: {
    marginBottom: 16,
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
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontSize: 14,
    color: '#111827',
  },
  registerBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  registerBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 30,
  },
  footerText: {
    color: '#4B5563',
    fontSize: 14,
  },
  loginLink: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
  },
});
