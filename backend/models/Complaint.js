const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaintId: { type: String, required: true, unique: true },
  bookingId: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userRole: { type: String, enum: ['customer', 'provider'], required: true },
  category: { type: String, required: true }, // e.g. Quality, Payment, Conduct, Late Arrival
  subject: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['open', 'under_review', 'resolved', 'rejected'], default: 'open' },
  adminResolution: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
