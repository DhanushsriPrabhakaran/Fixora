const Provider = require('../models/Provider');

exports.getProviders = async (req, res) => {
  try {
    const { categoryType, search, verified } = req.query;
    let query = {};

    if (categoryType) query.categoryType = categoryType;
    if (verified === 'true') query.verified = true;
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const providers = await Provider.find(query);
    res.json({ success: true, data: providers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }
    res.json({ success: true, data: provider });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.submitVerification = async (req, res) => {
  try {
    const { providerId, idProof, certificationProof } = req.body;
    const provider = await Provider.findById(providerId);

    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    provider.documentsSubmitted = {
      idProof,
      certificationProof,
      submittedAt: new Date()
    };
    await provider.save();

    res.json({ success: true, message: 'Verification documents submitted successfully', data: provider });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { providerId, rating, comment, serviceName, customerId, customerName } = req.body;
    const provider = await Provider.findById(providerId);

    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    const newReview = {
      customerId,
      customerName,
      rating,
      comment,
      serviceName,
      date: new Date().toISOString().substring(0, 10)
    };

    provider.reviews.unshift(newReview);
    provider.reviewsCount = provider.reviews.length;
    const sum = provider.reviews.reduce((acc, r) => acc + r.rating, 0);
    provider.rating = Number((sum / provider.reviews.length).toFixed(1));

    await provider.save();
    res.json({ success: true, data: provider });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
