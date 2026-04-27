const express = require('express')
const router = express.Router()
const Progress = require('../models/progress')
const { requireAuth } = require('../middleware/auth')

// Save quiz result
router.post('/', requireAuth, async (req, res) => {
  try {
    const { courseId, quizScore, quizTotal } = req.body
    const userId = req.user.id

    // Check if progress already exists
    let progress = await Progress.findOne({ userId, courseId })
    if (progress) {
      // Update existing
      progress.quizScore = quizScore
      progress.quizTotal = quizTotal
      progress.completed = quizScore / quizTotal >= 0.7
      progress.attemptedAt = Date.now()
      await progress.save()
    } else {
      // Create new
      progress = await Progress.create({
        userId,
        courseId,
        quizScore,
        quizTotal,
        completed: quizScore / quizTotal >= 0.7
      })
    }
    res.json(progress)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get progress for a user
router.get('/:userId', requireAuth, async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.params.userId })
      .populate('courseId', 'title')
    res.json(progress)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router