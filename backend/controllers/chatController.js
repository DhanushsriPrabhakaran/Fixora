const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const messages = await Message.find({ bookingId }).sort({ createdAt: 1 });
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { bookingId, senderId, senderName, senderRole, text } = req.body;
    const message = await Message.create({
      bookingId,
      senderId,
      senderName,
      senderRole,
      text
    });
    res.status(201).json({ success: true, data: message });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
