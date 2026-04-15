const express = require('express');
const router = express.Router();
const Test = require('../models/Test');
const Result = require('../models/Result');
const { protect, adminOnly, approvedOnly } = require('../middleware/auth');

// Get tests for batch
router.get('/', protect, approvedOnly, async (req, res) => {
  try {
    const batch = req.user.role === 'admin' ? req.query.batch : req.user.batch;
    const query = batch ? { batch } : {};
    const tests = await Test.find(query).select('-questions.correctAnswer').sort({ createdAt: -1 });
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single test with questions (no answers)
router.get('/:id', protect, approvedOnly, async (req, res) => {
  try {
    const test = await Test.findById(req.params.id).select('-questions.correctAnswer');
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.json(test);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create test (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const totalMarks = req.body.questions?.reduce((sum, q) => sum + (q.marks || 1), 0) || 0;
    const test = await Test.create({ ...req.body, totalMarks, createdBy: req.user._id });
    res.status(201).json(test);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update test (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const totalMarks = req.body.questions?.reduce((sum, q) => sum + (q.marks || 1), 0) || 0;
    const test = await Test.findByIdAndUpdate(
      req.params.id,
      { ...req.body, totalMarks },
      { new: true }
    );
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.json(test);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit test
router.post('/:id/submit', protect, approvedOnly, async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ message: 'Test not found' });

    const existing = await Result.findOne({ student: req.user._id, test: req.params.id });
    if (existing) return res.status(400).json({ message: 'Test already submitted' });

    const { answers } = req.body;
    let score = 0;
    test.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) score += q.marks || 1;
    });

    const percentage = Math.round((score / test.totalMarks) * 100);
    const result = await Result.create({
      student: req.user._id, test: req.params.id,
      answers, score, totalMarks: test.totalMarks, percentage
    });
    res.status(201).json({ score, totalMarks: test.totalMarks, percentage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete test
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Test.findByIdAndDelete(req.params.id);
    res.json({ message: 'Test deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
