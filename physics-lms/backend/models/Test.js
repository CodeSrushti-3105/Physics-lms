const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: Number, required: true },
  marks: { type: Number, default: 1 }
});

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  batch: { type: String, enum: ['11th', '12th'], required: true },
  questions: [questionSchema],
  duration: { type: Number, default: 30 }, // minutes
  totalMarks: { type: Number },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Test', testSchema);
