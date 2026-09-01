const Complaint = require('../models/Complaint');

exports.createComplaint = async (req, res) => {
  try {
    const { bookingId, userId, userName, userRole, category, subject, description } = req.body;
    const complaintId = `CMP-${Math.floor(1000 + Math.random() * 9000)}`;

    const complaint = await Complaint.create({
      complaintId,
      bookingId,
      userId,
      userName,
      userRole,
      category,
      subject,
      description
    });

    res.status(201).json({ success: true, data: complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const { userId } = req.query;
    let query = {};
    if (userId) query.userId = userId;

    const complaints = await Complaint.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: complaints });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.resolveComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminResolution } = req.body;

    const complaint = await Complaint.findOne({ complaintId: id }) || await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    complaint.status = status;
    if (adminResolution) complaint.adminResolution = adminResolution;
    await complaint.save();

    res.json({ success: true, data: complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
