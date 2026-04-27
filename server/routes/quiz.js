const express = require('express')
const router = express.Router()
const Quiz = require('../models/quiz')
const { requireFaculty } = require('../middleware/auth')

// Get quizzes for a course
router.get('/:courseId', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ courseId: req.params.courseId })
    res.json(quizzes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Add quiz question (faculty only)
router.post('/', requireFaculty, async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body)
    res.status(201).json(quiz)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Delete quiz question (faculty only)
router.delete('/:id', requireFaculty, async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'Question deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router