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
    
    // For students: Generate verification token and send email
    // For admin: No verification needed
    const isStudent = !email.includes('admin'); // Simple check, you can improve this
    
    if (isStudent) {
      // Generate verification token for students
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      // Create student with verification token
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
      const emailSent = await sendVerificationEmail(email, name, verificationToken);
      
      if (!emailSent) {
        console.error('Failed to send verification email to:', email);
      }
      
      res.status(201).json({ 
        message: 'Registration successful! Please check your email to verify your account.'
      });
    } else {
      // Create admin without verification
      const user = await User.create({ 
        name, 
        email, 
        password, 
        batch, 
        role: 'admin', 
        status: 'approved',
        emailVerified: true // Admin doesn't need verification
      });
      
      res.status(201).json({ 
        message: 'Admin account created successfully!'
      });
    }
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
    
    // Check if email is verified (only for students, not admin)
    if (user.role === 'student' && !user.emailVerified) {
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
