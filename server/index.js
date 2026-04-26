require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')  // ← add this import

const Course = require('./models/course')
const Quiz = require('./models/quiz')
const User = require('./models/user')
const authRoutes = require('./routes/auth')
const Groq = require('groq-sdk')

const mongoUrl = process.env.MONGO_URI
const app = express()
const PORT = process.env.PORT || 5000
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

app.use(cors())
app.use(express.json())

mongoose.connect(mongoUrl)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err))

// ── verifyToken defined FIRST before any route uses it ──
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token provided' })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

app.get('/', (req, res) => {
  res.send('My Learning LMS Server is Running!')
})

// Auth routes
app.use('/api/auth', authRoutes)

// Course routes
app.post('/api/courses', verifyToken, async (req, res) => {
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

app.put('/api/courses/:id', verifyToken, async (req, res) => {
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

app.delete('/api/courses/:id', verifyToken, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'Course deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Enroll routes
app.post('/api/enroll', async (req, res) => {
  try {
    const { userId, courseId } = req.body
    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ error: 'User not found' })
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

app.get('/api/enroll/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('enrolledCourses')
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user.enrolledCourses)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Quiz routes
app.post('/api/quiz', async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body)
    res.status(201).json(quiz)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/quiz/:courseId', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ courseId: req.params.courseId })
    res.json(quizzes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/quiz/result', async (req, res) => {
  try {
    const { userId, courseId, score, total } = req.body
    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ message: 'Result saved', score, total })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Groq AI chat route
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful learning assistant for an e-learning platform called My Learning. Answer questions related to courses and education only. Keep answers concise.'
        },
        {
          role: 'user',
          content: message
        }
      ],
      model: 'llama3-8b-8192',
    })
    const reply = completion.choices[0]?.message?.content || 'Sorry, I could not answer that.'
    res.json({ reply })
  } catch (err) {
    console.log('GROQ ERROR:', err)
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})