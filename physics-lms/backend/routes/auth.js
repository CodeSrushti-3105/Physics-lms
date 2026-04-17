const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Email validation regex
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, password, batch } = req.body;
    let { email } = req.body;
    
    // Normalize email: trim and convert to lowercase
    email = email.trim().toLowerCase();
    
    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    // Check if email already exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    
    // Determine if admin or student
    const isAdmin = email.includes('admin');
    
    if (isAdmin) {
      // Create admin account - auto-approved
      const user = await User.create({ 
        name, 
        email, 
        password, 
        batch, 
        role: 'admin', 
        status: 'approved',
        emailVerified: true
      });
      
      res.status(201).json({ 
        message: 'Admin account created successfully!'
      });
    } else {
      // Create student account - pending admin approval
      const user = await User.create({ 
        name, 
        email, 
        password, 
        batch, 
        role: 'student', 
        status: 'pending',
        emailVerified: true // No email verification needed
      });
      
      res.status(201).json({ 
        message: 'Registration successful! Your account is pending admin approval.'
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;
    
    // Normalize email: trim and convert to lowercase
    email = email.trim().toLowerCase();
    
    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    const user = await User.findOne({ email });
    
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    
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

// Forgot Password (Case-insensitive name matching)
router.post('/forgot-password', async (req, res) => {
  try {
    let { email, name, newPassword } = req.body;
    
    // Normalize email
    email = email.trim().toLowerCase();
    
    // Normalize name
    name = name.trim();
    
    // Validate inputs
    if (!email || !name || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    // Validate password length
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }
    
    // Verify name matches (case-insensitive, trimmed) - works for old and new users
    const userNameNormalized = user.name.trim().toLowerCase();
    const inputNameNormalized = name.toLowerCase();
    
    if (userNameNormalized !== inputNameNormalized) {
      return res.status(401).json({ message: 'Name does not match our records' });
    }
    
    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password reset successful! You can now login with your new password.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
