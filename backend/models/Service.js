const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  categoryType: { type: String, enum: ['home', 'elder_care', 'child_care'], required: true },
  description: { type: String, required: true },
  startingPrice: { type: Number, required: true },
  unit: { type: String, default: '/job' },
  rating: { type: Number, default: 4.8 },
  icon: { type: String, required: true },
  image: { type: String, required: true },
  popular: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
