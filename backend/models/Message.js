const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  bookingId: { type: String, required: true },
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  senderRole: { type: String, enum: ['customer', 'provider', 'admin'], required: true },
  text: { type: String, required: true },
  read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
