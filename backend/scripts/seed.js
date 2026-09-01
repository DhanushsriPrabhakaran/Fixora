const mongoose = require('mongoose');
const User = require('../models/User');
const Provider = require('../models/Provider');
const Service = require('../models/Service');
const Category = require('../models/Category');
const Offer = require('../models/Offer');
require('dotenv').config();

const categories = [
  { name: 'Home Maintenance', type: 'home', icon: 'wrench', description: 'Plumbing, Electrical, Carpentry, Painting & Repair', itemCount: 12 },
  { name: 'Deep Cleaning', type: 'home', icon: 'sparkles', description: 'Home, Kitchen, Bathroom & Sofa cleaning', itemCount: 8 },
  { name: 'Elder Care', type: 'elder_care', icon: 'heart-pulse', description: 'Companionship, Daily Help & Medical Assistance', itemCount: 6 },
  { name: 'Child Care', type: 'child_care', icon: 'baby-carriage', description: 'Babysitting, Tutoring & Supervision', itemCount: 5 }
];

const services = [
  { name: 'Senior Companion & Caregiver', category: 'Elder Care', categoryType: 'elder_care', description: 'Compassionate assistance for daily activities, companionship, and medication tracking.', startingPrice: 25, unit: '/hr', rating: 4.9, icon: 'heart', image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80', popular: true },
  { name: 'Certified Babysitting', category: 'Child Care', categoryType: 'child_care', description: 'Experienced caregiver for infant, toddler, and after-school childcare.', startingPrice: 20, unit: '/hr', rating: 4.8, icon: 'baby', image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80', popular: true },
  { name: 'Full House Deep Cleaning', category: 'Deep Cleaning', categoryType: 'home', description: 'Thorough sanitization of living areas, bedrooms, kitchen & bathrooms.', startingPrice: 120, unit: '/job', rating: 4.9, icon: 'sparkles', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80', popular: true },
  { name: 'Emergency Plumbing Repair', category: 'Home Maintenance', categoryType: 'home', description: 'Leak fixes, pipe unclogging, faucet replacement & drain clearance.', startingPrice: 45, unit: '/job', rating: 4.7, icon: 'faucet', image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80', popular: true }
];

const offers = [
  { code: 'FIXORA10', title: '10% OFF First Service', description: 'Get 10% instant discount on your first booking!', discountPercentage: 10, maxDiscount: 25, minBookingAmount: 30, validUntil: '2026-12-31' },
  { code: 'ELDERCARE15', title: '15% OFF Elder Care', description: 'Save 15% on senior companion & caregiver packages.', discountPercentage: 15, maxDiscount: 50, minBookingAmount: 50, validUntil: '2026-12-31' }
];

const seedDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fixora';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for Seeding...');

    await Category.deleteMany({});
    await Service.deleteMany({});
    await Offer.deleteMany({});

    await Category.insertMany(categories);
    await Service.insertMany(services);
    await Offer.insertMany(offers);

    console.log('Database Seeded Successfully!');
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDB();
