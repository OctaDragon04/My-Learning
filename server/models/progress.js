const mongoose = require('mongoose')

const ProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  quizScore: { type: Number, default: 0 },
  quizTotal: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  attemptedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Progress', ProgressSchema)