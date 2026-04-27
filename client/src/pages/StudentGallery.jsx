import { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap'
import { getCourses, enrollCourse, getEnrolledCourses, getRecommendations } from '../api/courses'
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
  const [search, setSearch] = useState('')
  const [recommendations, setRecommendations] = useState('')
  const [loadingRec, setLoadingRec] = useState(false)

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

  const handleRecommendations = async () => {
    setLoadingRec(true)
    try {
      const enrolledCourses = courses.filter(c => enrolled.includes(c._id))
      const res = await getRecommendations({
        enrolledCourses,
        allCourses: courses
      })
      setRecommendations(res.data.recommendations)
    } catch (err) {
      setRecommendations('Could not get recommendations right now.')
    } finally {
      setLoadingRec(false)
    }
  }

  const isEnrolled = (courseId) => enrolled.includes(courseId)

  const filteredCourses = courses
    .filter(c => activeTab === 'all' ? true : enrolled.includes(c._id))
    .filter(c => c.title.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <Spinner animation="border" className="m-4" />

  return (
    <Container className="py-4">
      {message && (
        <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>
          {message}
        </Alert>
      )}

      {/* Recommendations */}
      {user?.role === 'student' && enrolled.length > 0 && (
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <strong>🤖 AI Course Recommendations</strong>
              <Button variant="outline-primary" size="sm"
                onClick={handleRecommendations}
                disabled={loadingRec}>
                {loadingRec ? 'Getting recommendations...' : 'Get Recommendations'}
              </Button>
            </div>
            {recommendations && (
              <p className="mt-2 mb-0" style={{ fontSize: 13 }}>{recommendations}</p>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Tabs and Search */}
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <h4 className="mb-0">
          {activeTab === 'all' ? 'Course Gallery' : 'My Courses'}
          <Badge bg="secondary" className="ms-2">{filteredCourses.length}</Badge>
        </h4>
        <div className="d-flex gap-2 flex-wrap">
          <input
            className="form-control form-control-sm"
            style={{ width: 200 }}
            placeholder="Search courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {user && user.role === 'student' && (
            <>
              <Button
                variant={activeTab === 'all' ? 'dark' : 'outline-dark'}
                size="sm"
                onClick={() => setActiveTab('all')}
              >
                All Courses
              </Button>
              <Button
                variant={activeTab === 'my' ? 'dark' : 'outline-dark'}
                size="sm"
                onClick={() => setActiveTab('my')}
              >
                My Courses ({enrolled.length})
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Course Cards */}
      <Row xs={1} sm={2} md={3} className="g-3">
        {filteredCourses.map(course => (
          <Col key={course._id}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-1">
                  <Card.Title style={{ fontSize: '15px', marginBottom: 0 }}>{course.title}</Card.Title>
                  {course.category && <Badge bg="secondary" style={{ fontSize: 10 }}>{course.category}</Badge>}
                </div>
                <Card.Text style={{ fontSize: '13px', color: '#666', flexGrow: 1 }}>
                  {course.description}
                </Card.Text>
                {course.instructorName && (
                  <p style={{ fontSize: '12px', color: '#888', marginBottom: 4 }}>
                    👨‍🏫 {course.instructorName}
                  </p>
                )}

                <div className="d-flex gap-2 mt-2 flex-wrap">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => navigate(`/course/${course._id}`)}
                  >
                    View Details
                  </Button>
                  {user && user.role === 'student' && (
                    <Button
                      variant={isEnrolled(course._id) ? 'success' : 'primary'}
                      size="sm"
                      onClick={() => handleEnroll(course._id)}
                      disabled={isEnrolled(course._id)}
                    >
                      {isEnrolled(course._id) ? '✅ Enrolled' : 'Enroll Now'}
                    </Button>
                  )}
                  {user && user.role === 'student' && isEnrolled(course._id) && (
                    <Button
                      variant="outline-dark"
                      size="sm"
                      onClick={() => navigate(`/quiz/${course._id}`)}
                    >
                      📝 Quiz
                    </Button>
                  )}
                  {!user && (
                    <Button variant="outline-primary" size="sm"
                      onClick={() => navigate('/login')}>
                      Login to Enroll
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredCourses.length === 0 && (
        <p style={{ color: '#888' }}>
          {activeTab === 'my' ? 'You have not enrolled in any courses yet.' : 'No courses found.'}
        </p>
      )}
    </Container>
  )
}