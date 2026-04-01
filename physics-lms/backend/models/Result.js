const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  answers: [{ type: Number }],
  score: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  percentage: { type: Number },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', resultSchema);
