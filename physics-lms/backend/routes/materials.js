const express = require('express');
const router = express.Router();
const Material = require('../models/Material');
const { protect, adminOnly, approvedOnly } = require('../middleware/auth');
const { upload, cloudinary } = require('../config/cloudinary');

// Get materials for batch
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

// Add material with optional file upload (admin only)
router.post('/', protect, adminOnly, (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      console.error('Multer/Cloudinary error:', err.message || err);
      return res.status(400).json({ message: err.message || 'File upload failed' });
    }
    try {
      const { title, description, content, batch, type } = req.body;
      const url = req.file ? req.file.path : req.body.url;
      const filePublicId = req.file ? req.file.filename : undefined;

      // For raw files (PDFs, docs), modify URL to force download
      let finalUrl = url;
      if (req.file && !req.file.mimetype.startsWith('image/')) {
        // Insert fl_attachment into Cloudinary URL for forced download
        finalUrl = url.replace('/upload/', '/upload/fl_attachment/');
      }

      const material = await Material.create({
        title, description, content, batch, type,
        url: finalUrl, filePublicId,
        createdBy: req.user._id
      });
      res.status(201).json(material);
    } catch (err) {
      console.error('DB error:', err.message);
      res.status(500).json({ message: err.message });
    }
  });
});

// Delete material
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ message: 'Not found' });

    if (material.filePublicId) {
      try {
        await cloudinary.uploader.destroy(material.filePublicId, { resource_type: 'raw' });
      } catch {
        await cloudinary.uploader.destroy(material.filePublicId, { resource_type: 'image' });
      }
    }

    await material.deleteOne();
    res.json({ message: 'Material deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
