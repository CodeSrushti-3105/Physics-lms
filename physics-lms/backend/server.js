const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      'http://localhost:3000',
      'https://physics-lms.vercel.app',
      process.env.FRONTEND_URL,
    ].filter(Boolean);
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowed.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/materials', require('./routes/materials'));
app.use('/api/tests', require('./routes/tests'));
app.use('/api/results', require('./routes/results'));

// Seed admin on first run
const seedAdmin = async () => {
  const User = require('./models/User');
  const exists = await User.findOne({ role: 'admin' });
  if (!exists) {
    await User.create({
      name: 'Admin Teacher',
      email: 'admin@physics.com',
      password: 'admin123',
      role: 'admin',
      status: 'approved'
    });
    console.log('Admin seeded: admin@physics.com / admin123');
  }
};

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await seedAdmin();
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
  })
  .catch(err => console.error(err));
