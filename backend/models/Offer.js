const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  discountPercentage: { type: Number, required: true },
  maxDiscount: { type: Number, required: true },
  minBookingAmount: { type: Number, default: 0 },
  validUntil: { type: String, required: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);
