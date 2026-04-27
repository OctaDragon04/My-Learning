const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,        // saves email in lowercase always
  trim: true,             // removes accidental spaces
  match: [
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    'Please enter a valid email address'
  ]
},
  password: {type: String, required: true,trim: true},
  role: { 
    type: String, 
    enum: ['student', 'faculty'], 
    default: 'student'
  },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
})

module.exports = mongoose.model('User', UserSchema)