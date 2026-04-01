const express = require('express');
const router = express.Router();
const Material = require('../models/Material');
const { protect, adminOnly, approvedOnly } = require('../middleware/auth');

// Get materials for student's batch
router.get('/', protect, approvedOnly, async (req, res) => {
  try {
    const batch = req.user.role === 'admin' ? req.query.batch : req.user.batch;
    const query = batch ? { batch } : {};
    const materials = await Material.find(query).sort({ createdAt: -1 });
    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add material (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const material = await Material.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(material);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete material
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Material.findByIdAndDelete(req.params.id);
    res.json({ message: 'Material deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
