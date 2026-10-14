const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

exports.createBooking = async (req, res) => {
  try {
    const bookingData = req.body;
    const bookingId = bookingData.id || `FIX-${Math.floor(1000 + Math.random() * 9000)}`;

    const booking = await Booking.create({
      bookingId,
      customerId: bookingData.customerId || 'cust_101',
      providerId: bookingData.providerId || 'prv_101',
      serviceId: bookingData.serviceId || 'srv_101',
      serviceName: bookingData.serviceName || 'General Service',
      providerName: bookingData.providerName || 'Certified Partner',
      providerImage: bookingData.providerImage || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      categoryType: bookingData.categoryType || 'home',
      date: bookingData.date || bookingData.scheduledDate || new Date().toISOString().substring(0, 10),
      timeSlot: bookingData.timeSlot || bookingData.scheduledTime || '10:00 AM',
      address: bookingData.address || 'Customer Location',
      landmark: bookingData.landmark || '',
      status: bookingData.status || 'confirmed',
      serviceCharge: bookingData.serviceCharge || bookingData.subtotalAmount || 50,
      additionalCharge: bookingData.additionalCharge || 0,
      discountAmount: bookingData.discountAmount || 0,
      totalAmount: bookingData.totalAmount || 50,
      paymentMethod: bookingData.paymentMethod || 'Credit / Debit Card',
      paymentStatus: bookingData.paymentStatus || 'paid',
      specialInstructions: bookingData.notes || bookingData.specialInstructions || '',
    });

    // Create notification
    await Notification.create({
      userId: booking.customerId,
      title: 'Booking Confirmed!',
      message: `Your booking (${bookingId}) for ${booking.serviceName} with ${booking.providerName} has been received.`,
      type: 'booking',
      bookingId
    });

    const formatted = {
      ...booking.toObject(),
      id: booking.bookingId
    };

    res.status(201).json({ success: true, data: formatted });
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
