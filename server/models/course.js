const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  instructorId: { type: String },
  instructorName: { type: String },
  contentUrl: { type: String },
  notes: { type: String },
  aiSummary: { type: String },
  category: { type: String, default: 'General' },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Course', CourseSchema)