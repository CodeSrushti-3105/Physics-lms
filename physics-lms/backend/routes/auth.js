const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { sendVerificationEmail } = require('../config/email');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, batch } = req.body;
    
    // Check if email already exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    // Create user with verification token
    const user = await User.create({ 
      name, 
      email, 
      password, 
      batch, 
      role: 'student', 
      status: 'pending',
      emailVerified: false,
      verificationToken,
      verificationTokenExpiry
    });
    
    // Send verification email
    await sendVerificationEmail(email, name, verificationToken);
    
    res.status(201).json({ 
      message: 'Registration successful! Please check your email to verify your account.'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    
    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(403).json({ 
        message: 'Please verify your email before logging in.'
      });
    }
    
    res.json({
      token: generateToken(user._id),
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        batch: user.batch, 
        status: user.status
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get current user
router.get('/me', protect, (req, res) => {
  res.json(req.user);
});

// Verify email
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    // Find user with this token
    const user = await User.findOne({ 
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid or expired verification link.'
      });
    }
    
    // Mark email as verified
    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();
    
    res.json({ 
      message: 'Email verified successfully! You can now log in.'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
