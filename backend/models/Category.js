const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['home', 'elder_care', 'child_care'], required: true },
  icon: { type: String, required: true },
  description: { type: String, required: true },
  itemCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
