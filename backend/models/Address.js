const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true }, // e.g. Home, Work, Parent's House
  name: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  area: { type: String, required: true },
  city: { type: String, required: true },
  zipCode: { type: String, required: true },
  landmark: { type: String, default: '' },
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema);
