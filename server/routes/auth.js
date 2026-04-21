const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const FACULTY_SECRET = 'FACULTY2024'
const JWT_SECRET = process.env.JWT_SECRET || 'myjwtsecret'

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, facultyCode } = req.body

    // Check if user already exists
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ error: 'Email already registered' })

    // Validate faculty code
    if (role === 'faculty' && facultyCode !== FACULTY_SECRET) {
      return res.status(400).json({ error: 'Invalid faculty code' })
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role || 'student'
    })

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ error: 'Invalid email or password' })

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' })

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'No token' })

    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')
    res.json(user)
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' })
  }
})

module.exports = router