require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const authRoutes     = require('./routes/auth')
const courseRoutes   = require('./routes/courses')
const aiRoutes       = require('./routes/ai')
const progressRoutes = require('./routes/progress')
const enrollRoutes   = require('./routes/enroll')
const quizRoutes     = require('./routes/quiz')

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

// Routes
app.use('/api/auth',     authRoutes)
app.use('/api/courses',  courseRoutes)
app.use('/api',          aiRoutes)
app.use('/api/progress', progressRoutes)
app.use('/api/enroll',   enrollRoutes)
app.use('/api/quiz',     quizRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})