const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

const requireAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'No token provided' })
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' })
  }
}

const requireFaculty = (req, res, next) => {
  requireAuth(req, res, () => {
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ error: 'Faculty access only' })
    }
    next()
  })
}

const requireStudent = (req, res, next) => {
  requireAuth(req, res, () => {
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Student access only' })
    }
    next()
  })
}

module.exports = { requireAuth, requireFaculty, requireStudent }