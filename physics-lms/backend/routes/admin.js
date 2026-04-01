const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Result = require('../models/Result');
const { protect, adminOnly } = require('../middleware/auth');

// Get all students
router.get('/students', protect, adminOnly, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get pending students
router.get('/students/pending', protect, adminOnly, async (req, res) => {
  try {
    const students = await User.find({ role: 'student', status: 'pending' }).select('-password');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve or reject student
router.patch('/students/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status))
      return res.status(400).json({ message: 'Invalid status' });
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'Student not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all results (admin view)
router.get('/results', protect, adminOnly, async (req, res) => {
  try {
    const results = await Result.find()
      .populate('student', 'name email batch')
      .populate('test', 'title batch')
      .sort({ submittedAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
