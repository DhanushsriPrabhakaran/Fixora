const mongoose = require('mongoose');
const User = require('../models/User');
const Provider = require('../models/Provider');
const Booking = require('../models/Booking');

async function testMongoIntegration() {
  try {
    const MONGODB_URI = 'mongodb://127.0.0.1:27017/fixora';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Compass Database (`fixora`)...\n');

    // 1. Clean test records if any
    await User.deleteMany({ email: { $in: ['test_user_app@example.com', 'test_provider_app@example.com'] } });
    await Provider.deleteMany({ name: 'Test Care Provider' });

    // 2. Test Registering User
    console.log('1. Registering Customer in MongoDB...');
    const userDoc = await User.create({
      name: 'Test Customer',
      email: 'test_user_app@example.com',
      password: 'password123',
      phone: '+1 555-9999',
      role: 'customer',
      address: '100 Broadway St',
      city: 'New York Metro'
    });
    console.log('   Customer saved to MongoDB users collection:', userDoc._id.toString());

    // 3. Test Registering Provider
    console.log('\n2. Registering Service Provider in MongoDB...');
    const providerUserDoc = await User.create({
      name: 'Test Care Provider',
      email: 'test_provider_app@example.com',
      password: 'password123',
      phone: '+1 555-8888',
      role: 'provider',
      address: '200 Health Ave',
      city: 'New York Metro',
      verificationStatus: 'pending'
    });

    const providerDoc = await Provider.create({
      userId: providerUserDoc._id,
      name: providerUserDoc.name,
      profileImage: providerUserDoc.profileImage,
      tagline: 'Certified Elder & Home Care Specialist',
      categoryType: 'elder_care',
      servicesOffered: ['Senior Companion & Caregiver'],
      experienceYears: 5,
      rating: 5.0,
      reviewsCount: 0,
      verified: false,
      startingPrice: 40,
      serviceArea: providerUserDoc.address,
      bio: 'Experienced caregiver providing dedicated care and support.'
    });
    console.log('   Provider User saved to MongoDB users collection:', providerUserDoc._id.toString());
    console.log('   Provider Profile saved to MongoDB providers collection:', providerDoc._id.toString());

    // 4. Query All Registered Users & Providers from MongoDB
    console.log('\n3. Querying Registered Accounts from MongoDB Compass DB:');
    const allUsers = await User.find({}).select('-password');
    console.log(`   Total Users in 'users' collection: ${allUsers.length}`);
    allUsers.forEach(u => console.log(`   - [${u.role.toUpperCase()}] ${u.name} (${u.email})`));

    const allProviders = await Provider.find({});
    console.log(`\n   Total Providers in 'providers' collection: ${allProviders.length}`);
    allProviders.forEach(p => console.log(`   - 🛠️ ${p.name} | Category: ${p.categoryType} | Rate: $${p.startingPrice}/hr | Verified: ${p.verified}`));

    // 5. Test Booking Persistence
    console.log('\n4. Creating Test Booking in MongoDB:');
    const bookingDoc = await Booking.create({
      bookingId: `FIX-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: userDoc._id.toString(),
      customerName: userDoc.name,
      customerPhone: userDoc.phone,
      providerId: providerDoc._id.toString(),
      providerName: providerDoc.name,
      providerImage: providerDoc.profileImage,
      serviceId: 'srv_elder_1',
      serviceName: 'Senior Companion & Caregiver',
      categoryType: 'elder_care',
      date: '2026-09-20',
      timeSlot: '10:00 AM',
      durationHours: 3,
      address: userDoc.address,
      notes: 'Please bring medication log',
      serviceCharge: 120,
      subtotalAmount: 120,
      taxAmount: 10,
      totalAmount: 130,
      paymentMethod: 'credit_card',
      paymentStatus: 'paid',
      status: 'confirmed'
    });
    console.log('   Booking saved to MongoDB bookings collection:', bookingDoc.bookingId);


    console.log('\nSUCCESS: ALL MONGODB REGISTRATION & PERSISTENCE VERIFIED!');
    process.exit(0);
  } catch (err) {
    console.error('Test Failed:', err);
    process.exit(1);
  }
}

testMongoIntegration();
