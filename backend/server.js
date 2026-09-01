const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const providerRoutes = require('./routes/providerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const chatRoutes = require('./routes/chatRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const offerRoutes = require('./routes/offerRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/offers', offerRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'healthy', app: 'Fixora REST API', time: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fixora';

mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 })
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`Fixora API Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('MongoDB not active, launching Fixora Standalone REST Server...');
    app.listen(PORT, () => {
      console.log(`Fixora Standalone REST Server running on http://localhost:${PORT}`);
    });
  });
