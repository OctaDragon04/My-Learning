const express = require('express')
const router = express.Router()
const Course = require('../models/course')
const { requireFaculty } = require('../middleware/auth')

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find()
    res.json(courses)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Add new course (faculty only)
router.post('/', requireFaculty, async (req, res) => {
  try {
    const newCourse = new Course({
      ...req.body,
      instructorId: req.user.id,
    })
    const savedCourse = await newCourse.save()
    res.status(201).json(savedCourse)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update course (faculty only)
router.put('/:id', requireFaculty, async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(
        req.params.id,
        req.body,
        { returnDocument: 'after' }
    )
    res.status(200).json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Delete course (faculty only)
router.delete('/:id', requireFaculty, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'Course deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router