const mongoose = require('mongoose')

const QuizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  question: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: Number }, // index of correct option
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Quiz', QuizSchema)