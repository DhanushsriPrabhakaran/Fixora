const User = require('../models/User');
const Provider = require('../models/Provider');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const DEFAULT_USERS_MEM = [
  {
    id: 'cust_101',
    name: 'Dhanush',
    email: 'dhanush@example.com',
    password: 'password123',
    phone: '+1 (555) 234-5678',
    role: 'customer',
    address: '42 Maplewood Avenue, Suite 4B',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    city: 'New York Metro',
    verificationStatus: 'not_submitted',
  },
  {
    id: 'prv_101',
    name: 'Elena Rostova',
    email: 'elena@fixora.care',
    password: 'password123',
    phone: '+1 (555) 345-6789',
    role: 'provider',
    address: '15 Healthcare Way, Suite 200',
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    city: 'New York Metro',
    verificationStatus: 'approved',
  },
  {
    id: 'prv_102',
    name: 'Marcus Vance',
    email: 'marcus@fixora.care',
    password: 'password123',
    phone: '+1 (555) 876-5432',
    role: 'provider',
    address: '77 Tech Drive, Apt 3',
    profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    city: 'New York Metro',
    verificationStatus: 'approved',
  },
  {
    id: 'admin_001',
    name: 'Platform Admin',
    email: 'admin@fixora.care',
    password: 'adminpassword123',
    phone: '+1 (800) 555-ADMIN',
    role: 'admin',
    address: '1 Fixora Plaza, Executive Suite 10',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    city: 'New York Metro',
    verificationStatus: 'approved',
  }
];

const generateToken = (id, role, email) => {
  return jwt.sign({ id, role, email }, process.env.JWT_SECRET || 'fixora_super_secret_jwt_key_2026', {
    expiresIn: '30d',
  });
};

exports.register = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      phone, 
      role, 
      address, 
      city, 
      categoryType, 
      tagline, 
      bio, 
      experienceYears, 
      startingPrice, 
      servicesOffered 
    } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (mongoose.connection.readyState === 1) {
      let userExists = await User.findOne({ email: cleanEmail });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }

      const user = await User.create({
        name,
        email: cleanEmail,
        password,
        phone: phone || '+1 555-0000',
        role: role || 'customer',
        address: address || '123 Main Street',
        city: city || 'New York Metro',
        verificationStatus: role === 'provider' ? 'pending' : 'not_submitted',
      });

      let providerRecord = null;
      if (user.role === 'provider') {
        const categoryMap = {
          'Elder Care': 'elder_care',
          'Child Care': 'child_care',
          'Home Maintenance': 'home',
          'Deep Cleaning': 'home',
        };
        const resolvedCategoryType = categoryMap[categoryType] || categoryType || 'home';

        providerRecord = await Provider.create({
          userId: user._id,
          name: user.name,
          profileImage: user.profileImage,
          tagline: tagline || `${user.city || 'Certified'} Service Professional`,
          categoryType: resolvedCategoryType,
          servicesOffered: servicesOffered && servicesOffered.length > 0 ? servicesOffered : ['General Service'],
          experienceYears: Number(experienceYears || 3),
          qualifications: ['Safety Certified', 'Identity Verified'],
          certifications: ['Fixora Care Partner'],
          languages: ['English'],
          rating: 5.0,
          reviewsCount: 0,
          verified: false,
          availabilityStatus: 'Available Today',
          startingPrice: Number(startingPrice || 35),
          serviceArea: user.address || user.city || 'Citywide',
          bio: bio || `Professional service provider specializing in quality care and home maintenance. Dedicated to safety and client satisfaction.`,
          reviews: [],
          earnings: { total: 0, withdrawable: 0, pending: 0 }
        });
      }

      const token = generateToken(user._id, user.role, user.email);

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          address: user.address,
          profileImage: user.profileImage,
          city: user.city,
          verificationStatus: user.verificationStatus,
          providerProfile: providerRecord,
          token
        }
      });
    } else {
      // In-memory fallback mode
      const exists = DEFAULT_USERS_MEM.find(u => u.email.toLowerCase() === cleanEmail);
      if (exists) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }

      const newUser = {
        id: `usr_${Date.now()}`,
        name,
        email: cleanEmail,
        password,
        phone: phone || '+1 555-0000',
        role: role || 'customer',
        address: address || '123 Main Street',
        city: city || 'New York Metro',
        verificationStatus: role === 'provider' ? 'pending' : 'not_submitted',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      };
      DEFAULT_USERS_MEM.unshift(newUser);

      const token = generateToken(newUser.id, newUser.role, newUser.email);
      return res.status(201).json({
        success: true,
        message: 'User registered successfully (in-memory)',
        data: { ...newUser, token }
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter your email/phone and password.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: cleanEmail });

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      if (role && user.role !== role) {
        return res.status(400).json({ 
          success: false, 
          message: `Account is registered as ${user.role.toUpperCase()}. Please select ${user.role.charAt(0).toUpperCase() + user.role.slice(1)} portal.` 
        });
      }

      const token = generateToken(user._id, user.role, user.email);

      return res.json({
        success: true,
        message: 'Logged in successfully from MongoDB',
        data: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          address: user.address,
          profileImage: user.profileImage,
          city: user.city,
          verificationStatus: user.verificationStatus,
          token
        }
      });
    } else {
      // In-memory fallback verification
      const user = DEFAULT_USERS_MEM.find(u => u.email.toLowerCase() === cleanEmail);

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      if (user.password !== password) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      if (role && user.role !== role) {
        return res.status(400).json({ 
          success: false, 
          message: `Account is registered as ${user.role.toUpperCase()}. Please select ${user.role.charAt(0).toUpperCase() + user.role.slice(1)} portal.` 
        });
      }

      const token = generateToken(user.id, user.role, user.email);
      return res.json({
        success: true,
        message: 'Logged in successfully',
        data: { ...user, token }
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const users = await User.find({}).select('-password').sort({ createdAt: -1 });
      const formatted = users.map(u => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        address: u.address,
        city: u.city,
        profileImage: u.profileImage,
        verificationStatus: u.verificationStatus,
        createdAt: u.createdAt
      }));
      return res.json({ success: true, data: formatted });
    } else {
      return res.json({ success: true, data: DEFAULT_USERS_MEM });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.json({ success: true, data: user });
    } else {
      const user = DEFAULT_USERS_MEM.find(u => u.id === req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.json({ success: true, data: user });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide email and new password.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return res.status(404).json({ success: false, message: 'No account found with this email address.' });
      }

      user.password = newPassword;
      await user.save();

      return res.json({ success: true, message: `Password successfully updated for ${user.email}. You can now log in.` });
    } else {
      const user = DEFAULT_USERS_MEM.find(u => u.email.toLowerCase() === cleanEmail);
      if (!user) {
        return res.status(404).json({ success: false, message: 'No account found with this email address.' });
      }

      user.password = newPassword;
      return res.json({ success: true, message: `Password successfully updated for ${user.email}. You can now log in.` });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



