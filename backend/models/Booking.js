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
