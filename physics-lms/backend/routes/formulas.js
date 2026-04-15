const express = require('express');
const router = express.Router();
const Formula = require('../models/Formula');
const { protect, adminOnly } = require('../middleware/auth');

// Get all formulas (students and admin)
router.get('/', protect, async (req, res) => {
  try {
    const formulas = await Formula.find().sort({ category: 1, createdAt: -1 });
    res.json(formulas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create formula (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, formula, category, description } = req.body;
    const newFormula = await Formula.create({ title, formula, category, description });
    res.status(201).json(newFormula);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update formula (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { title, formula, category, description } = req.body;
    const updated = await Formula.findByIdAndUpdate(
      req.params.id,
      { title, formula, category, description },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete formula (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Formula.findByIdAndDelete(req.params.id);
    res.json({ message: 'Formula deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
