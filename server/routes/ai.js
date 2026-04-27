const express = require('express')
const router = express.Router()
const Groq = require('groq-sdk')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// Chatbot
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful learning assistant for an e-learning platform called My Learning. Answer questions related to courses and education only. Keep answers concise.'
        },
        { role: 'user', content: message }
      ],
      model: 'llama-3.3-70b-versatile',
    })
    const reply = completion.choices[0]?.message?.content || 'Sorry, I could not answer that.'
    res.json({ reply })
  } catch (err) {
    console.log('GROQ ERROR:', err)
    res.status(500).json({ error: err.message })
  }
})

// Generate AI Summary for a course
router.post('/summary', async (req, res) => {
  try {
    const { title, description } = req.body
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert educator. Generate a concise and informative course summary in 3-4 sentences.'
        },
        {
          role: 'user',
          content: `Generate a summary for a course titled "${title}" with description: "${description}"`
        }
      ],
      model: 'llama-3.3-70b-versatile',
    })
    const summary = completion.choices[0]?.message?.content || 'No summary available.'
    res.json({ summary })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get course recommendations
router.post('/recommendations', async (req, res) => {
  try {
    const { enrolledCourses, allCourses } = req.body
    const enrolledTitles = enrolledCourses.map(c => c.title).join(', ')
    const allTitles = allCourses.map(c => c.title).join(', ')

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a course recommendation system. Recommend courses from the available list based on what the student is already studying. Return only course titles as a comma-separated list.'
        },
        {
          role: 'user',
          content: `Student is enrolled in: ${enrolledTitles}. Available courses: ${allTitles}. Recommend 2-3 courses they should take next.`
        }
      ],
      model: 'llama-3.3-70b-versatile',
    })
    const recommendations = completion.choices[0]?.message?.content || ''
    res.json({ recommendations })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router