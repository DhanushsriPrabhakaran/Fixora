const Provider = require('../models/Provider');

const formatProvider = (p) => {
  const obj = p.toObject ? p.toObject() : p;
  return {
    ...obj,
    id: obj._id ? obj._id.toString() : obj.id,
  };
};

exports.getProviders = async (req, res) => {
  try {
    const { categoryType, search, verified } = req.query;
    let query = {};

    if (categoryType) query.categoryType = categoryType;
    if (verified === 'true') query.verified = true;
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const providers = await Provider.find(query).sort({ createdAt: -1 });
    const formatted = providers.map(formatProvider);
    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id) || await Provider.findOne({ userId: req.params.id });
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }
    res.json({ success: true, data: formatProvider(provider) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.submitVerification = async (req, res) => {
  try {
    const { providerId, idProof, certificationProof } = req.body;
    let provider = await Provider.findById(providerId) || await Provider.findOne({ userId: providerId });

    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    provider.documentsSubmitted = {
      idProof,
      certificationProof,
      submittedAt: new Date()
    };
    await provider.save();

    res.json({ success: true, message: 'Verification documents submitted successfully', data: formatProvider(provider) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { providerId, rating, comment, serviceName, customerId, customerName } = req.body;
    let provider = await Provider.findById(providerId) || await Provider.findOne({ userId: providerId });

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
    res.json({ success: true, data: formatProvider(provider) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

