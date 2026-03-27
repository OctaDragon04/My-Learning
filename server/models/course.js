const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  instructorId: { type: String, required: true }, // Clerk ID of the Faculty
  instructorName: { type: String },
  contentUrl: { type: String }, // Link to video or PDF
  aiSummary: { type: String }, // Placeholder for Gemini AI output
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', CourseSchema);