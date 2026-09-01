const Service = require('../models/Service');
const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getServices = async (req, res) => {
  try {
    const { category, type, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (type) query.categoryType = type;
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const services = await Service.find(query);
    res.json({ success: true, data: services });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
