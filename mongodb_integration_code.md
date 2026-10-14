# 🍃 Fixora MongoDB Database Integration Guide & Source Code

This document provides the complete source code and architecture for integrating **MongoDB** with the **Fixora** React Native & Express platform.

---

## 🏗️ 1. Architecture Overview

- **Database Engine**: MongoDB (Local Instance / MongoDB Compass / Atlas)
- **Database Name**: `fixora`
- **Default Connection String**: `mongodb://127.0.0.1:27017/fixora`
- **ORM / ODM**: Mongoose (`^8.x`)
- **Backend Framework**: Node.js + Express.js (`port 5000`)
- **Frontend Client**: React Native + TypeScript (`apiService`)

---

## 🔌 2. Backend Server & MongoDB Connection (`backend/server.js`)

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const providerRoutes = require('./routes/providerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const chatRoutes = require('./routes/chatRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const offerRoutes = require('./routes/offerRoutes');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/offers', offerRoutes);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fixora';

// Auto-seed default accounts on MongoDB connect
const autoSeedUsers = async () => {
  try {
    const defaultUsers = [
      { name: 'Dhanush', email: 'dhanush@example.com', password: 'password123', phone: '+1 (555) 234-5678', role: 'customer', address: '42 Maplewood Avenue', city: 'New York Metro' },
      { name: 'Elena Rostova', email: 'elena@fixora.care', password: 'password123', phone: '+1 (555) 345-6789', role: 'provider', address: '15 Healthcare Way', city: 'New York Metro', verificationStatus: 'approved' },
      { name: 'Marcus Vance', email: 'marcus@fixora.care', password: 'password123', phone: '+1 (555) 876-5432', role: 'provider', address: '77 Tech Drive', city: 'New York Metro', verificationStatus: 'approved' },
      { name: 'Platform Admin', email: 'admin@fixora.care', password: 'adminpassword123', phone: '+1 (800) 555-ADMIN', role: 'admin', address: '1 Fixora Executive Suite 10', city: 'New York Metro', verificationStatus: 'approved' }
    ];

    for (const u of defaultUsers) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        await User.create(u);
        console.log(`Auto-seeded account in MongoDB: ${u.email}`);
      }
    }
  } catch (err) {
    console.log('Auto-seed notice:', err.message);
  }
};

mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 })
  .then(async () => {
    console.log('MongoDB connected successfully');
    await autoSeedUsers();
    app.listen(PORT, () => {
      console.log(`Fixora API Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('MongoDB not active, launching Standalone Mode...');
    app.listen(PORT, () => {
      console.log(`Fixora Standalone REST Server running on http://localhost:${PORT}`);
    });
  });
```

---

## 📜 3. MongoDB Schemas & Mongoose Models

### A. User Schema (`backend/models/User.js`)
Handles password hashing via `bcryptjs` and role enumeration.

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  role: { type: String, enum: ['customer', 'provider', 'admin'], default: 'customer' },
  address: { type: String, default: '' },
  city: { type: String, default: 'New York Metro' },
  profileImage: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
  verificationStatus: { type: String, enum: ['not_submitted', 'pending', 'approved', 'rejected'], default: 'not_submitted' },
}, { timestamps: true });

// Hash password before saving to MongoDB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### B. Service Provider Schema (`backend/models/Provider.js`)

```javascript
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  serviceName: { type: String, required: true },
  date: { type: String, default: () => new Date().toISOString().substring(0, 10) }
});

const providerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  profileImage: { type: String, required: true },
  tagline: { type: String, default: 'Professional Service Provider' },
  categoryType: { type: String, enum: ['home', 'elder_care', 'child_care'], required: true },
  servicesOffered: [{ type: String }],
  experienceYears: { type: Number, default: 1 },
  qualifications: [{ type: String }],
  certifications: [{ type: String }],
  languages: [{ type: String }],
  rating: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  availabilityStatus: { type: String, enum: ['Available Today', 'Available Tomorrow', 'Busy'], default: 'Available Today' },
  startingPrice: { type: Number, default: 50 },
  serviceArea: { type: String, default: 'Citywide' },
  bio: { type: String, default: '' },
  reviews: [reviewSchema],
  earnings: {
    total: { type: Number, default: 0 },
    withdrawable: { type: Number, default: 0 },
    pending: { type: Number, default: 0 }
  },
  documentsSubmitted: {
    idProof: { type: String, default: '' },
    certificationProof: { type: String, default: '' },
    submittedAt: { type: Date }
  }
}, { timestamps: true });

module.exports = mongoose.model('Provider', providerSchema);
```

### C. Booking Schema (`backend/models/Booking.js`)

```javascript
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  customerId: { type: String, required: true },
  providerId: { type: String, required: true },
  serviceId: { type: String, required: true },
  serviceName: { type: String, required: true },
  providerName: { type: String, required: true },
  providerImage: { type: String, required: true },
  categoryType: { type: String, enum: ['home', 'elder_care', 'child_care'], required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  address: { type: String, required: true },
  landmark: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['confirmed', 'provider_assigned', 'on_the_way', 'in_progress', 'completed', 'cancelled', 'disputed'], 
    default: 'confirmed' 
  },
  serviceCharge: { type: Number, required: true },
  additionalCharge: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'Credit / Debit Card' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'paid' },
  ratingGiven: { type: Number },
  specialInstructions: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
```

---

## ⚡ 4. Express Authentication Controller (`backend/controllers/authController.js`)

```javascript
const User = require('../models/User');
const Provider = require('../models/Provider');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const generateToken = (id, role, email) => {
  return jwt.sign({ id, role, email }, process.env.JWT_SECRET || 'fixora_super_secret_jwt_key_2026', {
    expiresIn: '30d',
  });
};

// 1. User Registration Controller
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role, address, city } = req.body;
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

      const token = generateToken(user._id, user.role, user.email);
      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: { id: user._id.toString(), name: user.name, email: user.email, role: user.role, token }
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. User Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
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
        data: { id: user._id.toString(), name: user.name, email: user.email, role: user.role, token }
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3. Password Reset Controller
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const cleanEmail = email.trim().toLowerCase();

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return res.status(404).json({ success: false, message: 'No account found with this email address.' });
      }

      user.password = newPassword;
      await user.save();

      return res.json({ success: true, message: `Password successfully updated for ${user.email}.` });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
```

---

## 📱 5. React Native API Service (`src/services/api.ts`)

```typescript
import { User, UserRole, Booking, ServiceProvider } from '../types';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  isNetworkError?: boolean;
}

const BASE_URL_CANDIDATES = [
  'http://localhost:5000/api',
  'http://10.0.2.2:5000/api',
  'http://127.0.0.1:5000/api',
];

let workingBaseUrl: string | null = null;

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const urlsToTry = workingBaseUrl ? [workingBaseUrl, ...BASE_URL_CANDIDATES.filter(u => u !== workingBaseUrl)] : BASE_URL_CANDIDATES;

  for (const baseUrl of urlsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`${baseUrl}${endpoint}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        signal: controller.signal,
        ...options,
      });
      clearTimeout(timeoutId);

      workingBaseUrl = baseUrl;
      let json: any = {};
      try { json = await response.json(); } catch (e) {}

      if (!response.ok || (json && json.success === false)) {
        return { success: false, message: json.message || `Server error (${response.status})` };
      }

      return { success: true, data: json.data !== undefined ? json.data : json, message: json.message };
    } catch (err) {}
  }

  return { success: false, message: 'Backend server is unreachable.', isNetworkError: true };
}

export const apiService = {
  login: async (email: string, password?: string, role?: UserRole): Promise<ApiResponse<User>> => {
    return request<User>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
  },

  register: async (userData: Record<string, any>): Promise<ApiResponse<User>> => {
    return request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  resetPassword: async (email: string, newPassword: string): Promise<ApiResponse<any>> => {
    return request<any>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, newPassword }),
    });
  }
};
```
