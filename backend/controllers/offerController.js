const Offer = require('../models/Offer');

exports.getOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ active: true });
    res.json({ success: true, data: offers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.validateOffer = async (req, res) => {
  try {
    const { code, amount } = req.body;
    const offer = await Offer.findOne({ code: code.toUpperCase(), active: true });

    if (!offer) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
    }

    if (amount < offer.minBookingAmount) {
      return res.status(400).json({ 
        success: false, 
        message: `Minimum booking amount of $${offer.minBookingAmount} required for this coupon` 
      });
    }

    const calculatedDiscount = Math.min((amount * offer.discountPercentage) / 100, offer.maxDiscount);

    res.json({
      success: true,
      data: {
        code: offer.code,
        discountPercentage: offer.discountPercentage,
        discountAmount: calculatedDiscount
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
