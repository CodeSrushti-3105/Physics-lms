const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');

// Use memory storage for multer (temporary)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'image/jpeg', 'image/png', 'image/jpg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'), false);
    }
  }
});

// Get GridFS bucket
const getGridFSBucket = () => {
  const db = mongoose.connection.db;
  return new GridFSBucket(db, {
    bucketName: 'materials'
  });
};

module.exports = { upload, getGridFSBucket };
