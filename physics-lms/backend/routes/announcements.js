const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { protect, adminOnly } = require('../middleware/auth');

// Get announcements (students see only their batch + all)
router.get('/', protect, async (req, res) => {
  try {
    const query = req.user.role === 'admin' 
      ? {} 
      : { targetBatch: { $in: ['all', req.user.batch] } };
    
    const announcements = await Announcement.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get unread count
router.get('/unread-count', protect, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      return res.json({ count: 0 });
    }

    const query = { targetBatch: { $in: ['all', req.user.batch] } };
    
    // If user has read some announcements, count only newer ones
    if (req.user.lastReadAnnouncement) {
      const lastRead = await Announcement.findById(req.user.lastReadAnnouncement);
      if (lastRead) {
        query.createdAt = { $gt: lastRead.createdAt };
      }
    }
    
    const count = await Announcement.countDocuments(query);
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark announcements as read
router.post('/mark-read', protect, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      return res.json({ message: 'Admin does not need to mark as read' });
    }

    // Get the latest announcement for this user's batch
    const latestAnnouncement = await Announcement.findOne({
      targetBatch: { $in: ['all', req.user.batch] }
    }).sort({ createdAt: -1 });

    if (latestAnnouncement) {
      const User = require('../models/User');
      await User.findByIdAndUpdate(req.user._id, {
        lastReadAnnouncement: latestAnnouncement._id
      });
    }

    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create announcement (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { message, targetBatch } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }
    
    const announcement = await Announcement.create({
      message: message.trim(),
      targetBatch: targetBatch || 'all',
      createdBy: req.user._id
    });
    
    const populated = await Announcement.findById(announcement._id)
      .populate('createdBy', 'name');
    
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete announcement (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    
    await announcement.deleteOne();
    res.json({ message: 'Announcement deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
