const express = require('express')
const router = express.Router()
const User = require('../models/user')
const { requireAuth } = require('../middleware/auth')

// Enroll in a course
router.post('/', requireAuth, async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id
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

// Get enrolled courses
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('enrolledCourses')
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user.enrolledCourses)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router