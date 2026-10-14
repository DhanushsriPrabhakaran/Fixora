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
  ActivityIndicator 
} from 'react-native';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const RegisterScreen: React.FC = () => {
  const { register, navigateTo, screenParams } = useApp();
  const initialRole: UserRole = screenParams?.role || 'customer';

  const [role, setRole] = useState<UserRole>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  
  // Provider Specific fields
  const [categoryType, setCategoryType] = useState('Home Maintenance');
  const [tagline, setTagline] = useState('');
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState('3');
  const [startingRate, setStartingRate] = useState('35');

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const themeColors = {
    customer: '#2563EB',
    provider: '#059669',
    admin: '#7C3AED',
  };

  const accentColor = themeColors[role];

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !address) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      await register({
        name,
        email,
        phone,
        password,
        address,
        role,
        categoryType,
        tagline: tagline || `${categoryType} Expert Professional`,
        bio: bio || `Certified ${categoryType} care & service professional providing top-quality service.`,
        experienceYears: Number(experience) || 3,
        startingPrice: Number(startingRate) || 35,
      });
    } catch (err) {
      setErrorMsg('Registration failed. Please check network connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigateTo('Login')}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: accentColor }]}>
            {role === 'provider' ? 'Register as Care Partner' : (role === 'admin' ? 'Admin Registration' : 'Create Customer Account')}
          </Text>
          <Text style={styles.subtitle}>
            {role === 'provider' 
              ? 'Join Fixora as a verified service professional & connect directly to MongoDB database'
              : 'Join Fixora for trusted home maintenance, elder care & babysitting'}
          </Text>
        </View>

        {/* Role Toggle Selector */}
        <View style={styles.roleContainer}>
          <Text style={styles.roleLabel}>Account Type:</Text>
          <View style={styles.roleToggle}>
            <TouchableOpacity
              style={[
                styles.roleBtn, 
                role === 'customer' && { backgroundColor: '#2563EB' }
              ]}
              onPress={() => setRole('customer')}
            >
              <Text style={[styles.roleBtnText, role === 'customer' && styles.activeRoleBtnText]}>
                👨‍👩‍👧 Customer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleBtn, 
                role === 'provider' && { backgroundColor: '#059669' }
              ]}
              onPress={() => setRole('provider')}
            >
              <Text style={[styles.roleBtnText, role === 'provider' && styles.activeRoleBtnText]}>
                🛠️ Provider
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleBtn, 
                role === 'admin' && { backgroundColor: '#7C3AED' }
              ]}
              onPress={() => setRole('admin')}
            >
              <Text style={[styles.roleBtnText, role === 'admin' && styles.activeRoleBtnText]}>
                🛡️ Admin
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {errorMsg ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
          </View>
        ) : null}

        {/* Form Card */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder={role === 'provider' ? 'e.g. Elena Rostova' : 'e.g. Dhanush'}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. name@example.com"
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
            <Text style={styles.inputLabel}>Primary Address / Service Area *</Text>
            <TextInput
              style={styles.input}
              placeholder="Street address, city, area"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          {role === 'provider' && (
            <View style={styles.providerExtraBox}>
              <Text style={styles.extraHeaderTitle}>🛠️ Provider Profile Details</Text>
              
              <Text style={styles.inputLabel}>Primary Service Category *</Text>
              <View style={styles.catPickerRow}>
                {['Home Maintenance', 'Elder Care', 'Child Care', 'Deep Cleaning'].map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catChip, categoryType === cat && styles.catChipSelected]}
                    onPress={() => setCategoryType(cat)}
                  >
                    <Text style={[styles.catChipText, categoryType === cat && styles.catChipTextSelected]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Professional Tagline</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Certified Senior Care Specialist"
                  value={tagline}
                  onChangeText={setTagline}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Bio / Short Description</Text>
                <TextInput
                  style={[styles.input, { height: 60 }]}
                  placeholder="Describe your qualifications & experience..."
                  value={bio}
                  onChangeText={setBio}
                  multiline
                />
              </View>

              <View style={styles.rowTwoInputs}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Experience (Years)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="3"
                    value={experience}
                    onChangeText={setExperience}
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Starting Rate ($/hr)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="35"
                    value={startingRate}
                    onChangeText={setStartingRate}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              
              <Text style={styles.kycNotice}>
                🛡️ Note: Account and Provider Profile will be saved directly into MongoDB Compass database (`fixora.providers`).
              </Text>
            </View>
          )}

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

          <TouchableOpacity 
            style={[styles.registerBtn, { backgroundColor: accentColor }]} 
            onPress={handleRegister} 
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.registerBtnText}>
                Complete Registration as {role === 'provider' ? 'Provider' : (role === 'admin' ? 'Admin' : 'Customer')}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already registered?</Text>
          <TouchableOpacity onPress={() => navigateTo('Login')}>
            <Text style={[styles.loginLink, { color: accentColor }]}>Log In Here</Text>
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
    marginBottom: 16,
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
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  roleContainer: {
    marginBottom: 16,
  },
  roleLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  roleToggle: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    padding: 4,
    gap: 4,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 8,
  },
  roleBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  activeRoleBtnText: {
    color: '#FFFFFF',
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    color: '#991B1B',
    fontSize: 13,
    fontWeight: '600',
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
  providerExtraBox: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  extraHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#047857',
    marginBottom: 8,
  },
  catPickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  catChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  catChipSelected: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  catChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },
  catChipTextSelected: {
    color: '#FFFFFF',
  },
  rowTwoInputs: {
    flexDirection: 'row',
    gap: 10,
  },
  kycNotice: {
    fontSize: 11,
    color: '#065F46',
    fontStyle: 'italic',
    marginTop: 4,
  },
  registerBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  registerBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  footer: {
    alignItems: 'center',
    gap: 4,
    marginBottom: 30,
  },
  footerText: {
    color: '#4B5563',
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '800',
  },
});

