const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true }, // Links to Clerk Auth
  email: { type: String, required: true },
  name: { type: String },
  role: { 
    type: String, 
    enum: ['student', 'faculty'], 
    default: 'student' // Everyone is a student unless changed by an admin
  },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

module.exports = mongoose.model('User', UserSchema);