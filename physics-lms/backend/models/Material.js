const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  content: { type: String, required: true },
  batch: { type: String, enum: ['11th', '12th'], required: true },
  type: { type: String, enum: ['notes', 'video', 'pdf', 'link'], default: 'notes' },
  url: { type: String },
  filePublicId: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Material', materialSchema);
