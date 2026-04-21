require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const Course = require('./models/course')
const User = require('./models/user')
const authRoutes = require('./routes/auth')

const mongoUrl = process.env.MONGO_URI
const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

mongoose.connect(mongoUrl)
  .then(() => { console.log('Connected to MongoDB') })
  .catch((err) => { console.error('Error connecting to MongoDB:', err) })

app.get('/', (req, res) => {
  res.send('My Learning LMS Server is Running!')
})

// Auth routes
app.use('/api/auth', authRoutes)

// Course routes
app.post('/api/courses', async (req, res) => {
  try {
    const newCourse = new Course(req.body)
    const savedCourse = await newCourse.save()
    res.status(201).json(savedCourse)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find()
    res.json(courses)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/courses/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'Course deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/courses/:id', async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.status(200).json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Enroll in a course
app.post('/api/enroll', async (req, res) => {
  try {
    const { userId, courseId } = req.body
    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ error: 'User not found' })

    // Check if already enrolled
    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ error: 'Already enrolled' })
    }

    user.enrolledCourses.push(courseId)
    await user.save()
    res.json({ message: 'Enrolled successfully', enrolledCourses: user.enrolledCourses })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get enrolled courses of a user
app.get('/api/enroll/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('enrolledCourses')
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user.enrolledCourses)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})