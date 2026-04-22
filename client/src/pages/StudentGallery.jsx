import { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap'
import { getCourses, enrollCourse, getEnrolledCourses } from '../api/courses'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function StudentGallery() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [enrolled, setEnrolled] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await getCourses()
        setCourses(coursesRes.data)
        if (user) {
          const enrolledRes = await getEnrolledCourses(user.id)
          setEnrolled(enrolledRes.data.map(c => c._id))
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  const handleEnroll = async (courseId) => {
    if (!user) return setMessage('Please login to enroll!')
    if (user.role === 'faculty') return setMessage('Faculty cannot enroll in courses!')
    try {
      await enrollCourse(user.id, courseId)
      setEnrolled([...enrolled, courseId])
      setMessage('Enrolled successfully! 🎉')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage(err.response?.data?.error || 'Enrollment failed')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const isEnrolled = (courseId) => enrolled.includes(courseId)

  const displayCourses = activeTab === 'all'
    ? courses
    : courses.filter(c => enrolled.includes(c._id))

  if (loading) return <Spinner animation='border' className='m-4' />

  return (
    <Container className='py-4'>
      {message && (
        <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>
          {message}
        </Alert>
      )}

      {/* Tabs */}
      <div className='d-flex align-items-center justify-content-between mb-4'>
        <h4 className='mb-0'>
          {activeTab === 'all' ? 'Course Gallery' : 'My Courses'}
          <Badge bg='secondary' className='ms-2'>{displayCourses.length}</Badge>
        </h4>
        {user && user.role === 'student' && (
          <div className='d-flex gap-2'>
            <Button
              variant={activeTab === 'all' ? 'dark' : 'outline-dark'}
              size='sm'
              onClick={() => setActiveTab('all')}
            >
              All Courses
            </Button>
            <Button
              variant={activeTab === 'my' ? 'dark' : 'outline-dark'}
              size='sm'
              onClick={() => setActiveTab('my')}
            >
              My Courses ({enrolled.length})
            </Button>
          </div>
        )}
      </div>

      {/* Course Cards */}
      <Row xs={1} sm={2} md={3} className='g-3'>
        {displayCourses.map(course => (
          <Col key={course._id}>
            <Card className='h-100 shadow-sm'>
              <Card.Body className='d-flex flex-column'>
                <Card.Title style={{ fontSize: '15px' }}>{course.title}</Card.Title>
                <Card.Text style={{ fontSize: '13px', color: '#666', flexGrow: 1 }}>
                  {course.description}
                </Card.Text>

                {user && user.role === 'student' && (
                  <div className='d-flex gap-2 mt-2'>
                    <Button
                      variant={isEnrolled(course._id) ? 'success' : 'primary'}
                      size='sm'
                      onClick={() => handleEnroll(course._id)}
                      disabled={isEnrolled(course._id)}
                    >
                      {isEnrolled(course._id) ? '✅ Enrolled' : 'Enroll Now'}
                    </Button>
                    {isEnrolled(course._id) && (
                      <Button
                        variant='outline-dark'
                        size='sm'
                        onClick={() => navigate(`/quiz/${course._id}`)}
                      >
                        📝 Take Quiz
                      </Button>
                    )}
                  </div>
                )}

                {!user && (
                  <Button
                    variant='outline-primary'
                    size='sm'
                    className='mt-2'
                    onClick={() => navigate('/login')}
                  >
                    Login to Enroll
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {displayCourses.length === 0 && (
        <p style={{ color: '#888' }}>
          {activeTab === 'my'
            ? 'You have not enrolled in any courses yet.'
            : 'No courses available yet.'}
        </p>
      )}
    </Container>
  )
}