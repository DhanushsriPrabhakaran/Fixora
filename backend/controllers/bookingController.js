const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

exports.createBooking = async (req, res) => {
  try {
    const bookingData = req.body;
    const bookingId = `FIX-${Math.floor(1000 + Math.random() * 9000)}`;

    const booking = await Booking.create({
      ...bookingData,
      bookingId,
      status: 'confirmed'
    });

    // Create notification
    await Notification.create({
      userId: booking.customerId,
      title: 'Booking Confirmed!',
      message: `Your booking (${bookingId}) for ${booking.serviceName} with ${booking.providerName} has been received.`,
      type: 'booking',
      bookingId
    });

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const { customerId, providerId, status } = req.query;
    let query = {};

    if (customerId) query.customerId = customerId;
    if (providerId) query.providerId = providerId;
    if (status) query.status = status;

    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findOne({ bookingId: id }) || await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    let title = 'Booking Updated';
    let message = `Booking ${booking.bookingId} status is now ${status.replace('_', ' ')}.`;

    if (status === 'on_the_way') {
      title = 'Provider On The Way!';
      message = `${booking.providerName} is heading to ${booking.address}.`;
    } else if (status === 'in_progress') {
      title = 'Service Started';
      message = `${booking.providerName} has started ${booking.serviceName}.`;
    } else if (status === 'completed') {
      title = 'Service Completed 🎉';
      message = `Service for ${booking.serviceName} is complete. Please leave a rating!`;
    }

    await Notification.create({
      userId: booking.customerId,
      title,
      message,
      type: status === 'completed' ? 'review' : 'booking',
      bookingId: booking.bookingId
    });

    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
