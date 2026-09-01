const User = require('../models/User');
const Provider = require('../models/Provider');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Complaint = require('../models/Complaint');

exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalProviders = await Provider.countDocuments({});
    const verifiedProviders = await Provider.countDocuments({ verified: true });
    const pendingProviders = await Provider.countDocuments({ verified: false });

    const totalBookings = await Booking.countDocuments({});
    const activeBookings = await Booking.countDocuments({ status: { $in: ['confirmed', 'provider_assigned', 'on_the_way', 'in_progress'] } });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    const allBookings = await Booking.find({ status: 'completed' });
    const revenue = allBookings.reduce((acc, b) => acc + (b.totalAmount || 0), 0);

    const complaints = await Complaint.countDocuments({ status: 'open' });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProviders,
        verifiedProviders,
        pendingProviders,
        totalBookings,
        activeBookings,
        completedBookings,
        cancelledBookings,
        revenue,
        complaints
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const { approve } = req.body;

    const provider = await Provider.findById(id);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    provider.verified = approve === true;
    await provider.save();

    res.json({ success: true, message: `Provider ${approve ? 'approved' : 'rejected'} successfully`, data: provider });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
