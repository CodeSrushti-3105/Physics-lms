const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Readable } = require('stream');
const Material = require('../models/Material');
const { protect, adminOnly, approvedOnly } = require('../middleware/auth');
const { upload, getGridFSBucket } = require('../config/gridfs-native');

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
      console.error('Upload error:', err.message || err);
      return res.status(400).json({ message: err.message || 'File upload failed' });
    }
    
    try {
      const { title, description, content, batch, type } = req.body;
      
      const materialData = {
        title,
        description,
        content,
        batch,
        type,
        createdBy: req.user._id
      };

      // If file was uploaded, store in GridFS
      if (req.file) {
        const bucket = getGridFSBucket();
        const filename = `${Date.now()}_${req.file.originalname}`;
        
        // Create upload stream
        const uploadStream = bucket.openUploadStream(filename, {
          metadata: {
            originalName: req.file.originalname,
            uploadedBy: req.user._id,
            uploadedAt: new Date()
          }
        });

        // Convert buffer to stream and upload
        const readableStream = Readable.from(req.file.buffer);
        readableStream.pipe(uploadStream);

        // Wait for upload to complete
        await new Promise((resolve, reject) => {
          uploadStream.on('finish', resolve);
          uploadStream.on('error', reject);
        });

        materialData.fileId = uploadStream.id.toString();
        materialData.originalFileName = req.file.originalname;
      } else if (req.body.url) {
        // External URL (like YouTube, etc.)
        materialData.url = req.body.url;
      }

      const material = await Material.create(materialData);
      res.status(201).json(material);
    } catch (err) {
      console.error('DB error:', err.message);
      res.status(500).json({ message: err.message });
    }
  });
});

// View file (stream to browser)
router.get('/:id/view', protect, approvedOnly, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    if (!material.fileId) {
      return res.status(404).json({ message: 'No file attached to this material' });
    }

    const bucket = getGridFSBucket();
    
    // Check if fileId is a valid ObjectId
    let fileId;
    try {
      fileId = new mongoose.Types.ObjectId(material.fileId);
    } catch (err) {
      console.error('Invalid fileId format:', material.fileId);
      return res.status(400).json({ message: 'Invalid file ID format' });
    }

    // Set headers for inline viewing
    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', 'inline');

    // Stream file from GridFS
    const downloadStream = bucket.openDownloadStream(fileId);
    
    downloadStream.on('error', (error) => {
      console.error('Stream error:', error);
      if (!res.headersSent) {
        res.status(404).json({ message: 'File not found in storage' });
      }
    });

    downloadStream.pipe(res);
  } catch (err) {
    console.error('View error:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Failed to view file: ' + err.message });
    }
  }
});

// Download file
router.get('/:id/download', protect, approvedOnly, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    if (!material.fileId) {
      return res.status(404).json({ message: 'No file attached to this material' });
    }

    const bucket = getGridFSBucket();
    
    // Check if fileId is a valid ObjectId
    let fileId;
    try {
      fileId = new mongoose.Types.ObjectId(material.fileId);
    } catch (err) {
      console.error('Invalid fileId format:', material.fileId);
      return res.status(400).json({ message: 'Invalid file ID format' });
    }

    // Set headers for download
    const filename = material.originalFileName || `${material.title}.pdf`;
    res.set('Content-Type', 'application/octet-stream');
    res.set('Content-Disposition', `attachment; filename="${filename}"`);

    // Stream file from GridFS
    const downloadStream = bucket.openDownloadStream(fileId);
    
    downloadStream.on('error', (error) => {
      console.error('Download error:', error);
      if (!res.headersSent) {
        res.status(404).json({ message: 'File not found in storage' });
      }
    });

    downloadStream.pipe(res);
  } catch (err) {
    console.error('Download error:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Failed to download file: ' + err.message });
    }
  }
});

// Delete material
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Not found' });
    }

    // Delete file from GridFS if exists
    if (material.fileId) {
      try {
        const bucket = getGridFSBucket();
        const fileId = new mongoose.Types.ObjectId(material.fileId);
        await bucket.delete(fileId);
      } catch (error) {
        console.error('Error deleting file from GridFS:', error);
      }
    }

    await material.deleteOne();
    res.json({ message: 'Material deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
