const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const { protect, approvedOnly } = require('../middleware/auth');

// Get student's own results
router.get('/my', protect, approvedOnly, async (req, res) => {
  try {
    const results = await Result.find({ student: req.user._id })
      .populate('test', 'title batch totalMarks')
      .sort({ submittedAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
