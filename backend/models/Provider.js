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
  emergencySupport: { type: Boolean, default: false },
  supportedAgeGroups: [{ type: String }],
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
