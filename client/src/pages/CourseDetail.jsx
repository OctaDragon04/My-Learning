import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap'
import { getCourses, enrollCourse, getEnrolledCourses } from '../api/courses'
import { useAuth } from '../context/AuthContext'

export default function CourseDetail() {
  const { courseId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [enrolled, setEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCourses()
        const found = res.data.find(c => c._id === courseId)
        setCourse(found)
        if (user) {
          const enrolledRes = await getEnrolledCourses(user.id)
          setEnrolled(enrolledRes.data.some(c => c._id === courseId))
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [courseId, user])

  const handleEnroll = async () => {
    if (!user) return navigate('/login')
    try {
      await enrollCourse(user.id, courseId)
      setEnrolled(true)
      setMessage('Enrolled successfully! 🎉')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage(err.response?.data?.error || 'Enrollment failed')
    }
  }

  const isYouTube = (url) => url && (url.includes('youtube.com') || url.includes('youtu.be'))
  const getYouTubeId = (url) => {
    const match = url.match(/(?:v=|youtu\.be\/)([^&]+)/)
    return match ? match[1] : null
  }

  if (loading) return <Spinner animation="border" className="m-4" />
  if (!course) return <div className="p-4">Course not found</div>

  return (
    <Container className="py-4" style={{ maxWidth: 800 }}>
      {message && <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>{message}</Alert>}

      {/* Course Header */}
      <Card className="p-4 mb-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
          <div>
            <h3>{course.title}</h3>
            {course.category && <Badge bg="primary" className="me-2">{course.category}</Badge>}
            {course.instructorName && (
              <span style={{ fontSize: 13, color: '#666' }}>👨‍🏫 {course.instructorName}</span>
            )}
          </div>
          <div className="d-flex gap-2">
            {user?.role === 'student' && (
              <>
                <Button
                  variant={enrolled ? 'success' : 'primary'}
                  onClick={handleEnroll}
                  disabled={enrolled}
                >
                  {enrolled ? '✅ Enrolled' : 'Enroll Now'}
                </Button>
                {enrolled && (
                  <Button variant="outline-dark" onClick={() => navigate(`/quiz/${courseId}`)}>
                    📝 Take Quiz
                  </Button>
                )}
              </>
            )}
            <Button variant="outline-secondary" onClick={() => navigate('/gallery')}>
              ← Back
            </Button>
          </div>
        </div>
      </Card>

      {/* Video Player */}
      {course.contentUrl && isYouTube(course.contentUrl) && (
        <Card className="mb-4 shadow-sm">
          <Card.Header><strong>🎥 Video Content</strong></Card.Header>
          <Card.Body className="p-0">
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                src={`https://www.youtube.com/embed/${getYouTubeId(course.contentUrl)}`}
                title="Course Video"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Non-YouTube Content URL */}
      {course.contentUrl && !isYouTube(course.contentUrl) && (
        <Card className="mb-4 shadow-sm">
          <Card.Header><strong>📎 Course Content</strong></Card.Header>
          <Card.Body>
            <a href={course.contentUrl} target="_blank" rel="noreferrer">
              Click here to access course content
            </a>
          </Card.Body>
        </Card>
      )}

      {/* Description */}
      <Card className="mb-4 shadow-sm">
        <Card.Header><strong>📖 Description</strong></Card.Header>
        <Card.Body>
          <p style={{ fontSize: 14 }}>{course.description || 'No description available.'}</p>
        </Card.Body>
      </Card>

      {/* Notes / AI Summary */}
      {course.notes && (
        <Card className="mb-4 shadow-sm">
          <Card.Header><strong>🤖 Course Summary & Notes</strong></Card.Header>
          <Card.Body>
            <p style={{ fontSize: 14 }}>{course.notes}</p>
          </Card.Body>
        </Card>
      )}
    </Container>
  )
}