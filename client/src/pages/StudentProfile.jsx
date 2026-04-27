import { useEffect, useState } from 'react'
import { Container, Card, Row, Col, Badge, Spinner, Button } from 'react-bootstrap'
import { getEnrolledCourses, getProgress } from '../api/courses'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function StudentProfile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [enrolled, setEnrolled] = useState([])
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      Promise.all([
        getEnrolledCourses(user.id),
        getProgress(user.id)
      ]).then(([enrollRes, progressRes]) => {
        setEnrolled(enrollRes.data)
        setProgress(progressRes.data)
      }).finally(() => setLoading(false))
    }
  }, [user])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (loading) return <Spinner animation="border" className="m-4" />

  const passed = progress.filter(p => p.completed).length

  return (
    <Container className="py-4" style={{ maxWidth: 700 }}>
      {/* Profile Card */}
      <Card className="p-4 mb-4 shadow-sm">
        <div className="d-flex align-items-center gap-4">
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: '#0d6efd', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, fontWeight: 'bold'
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="mb-1">{user?.name}</h4>
            <p className="text-muted mb-1">{user?.email}</p>
            <Badge bg="primary">🎓 Student</Badge>
          </div>
          <Button variant="outline-danger" size="sm" className="ms-auto"
            onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <Row className="g-3 mb-4">
        <Col xs={4}>
          <Card className="text-center p-3 shadow-sm">
            <h3 className="text-primary">{enrolled.length}</h3>
            <p className="text-muted mb-0" style={{ fontSize: 13 }}>Enrolled</p>
          </Card>
        </Col>
        <Col xs={4}>
          <Card className="text-center p-3 shadow-sm">
            <h3 className="text-success">{passed}</h3>
            <p className="text-muted mb-0" style={{ fontSize: 13 }}>Passed</p>
          </Card>
        </Col>
        <Col xs={4}>
          <Card className="text-center p-3 shadow-sm">
            <h3 className="text-warning">{progress.length - passed}</h3>
            <p className="text-muted mb-0" style={{ fontSize: 13 }}>Pending</p>
          </Card>
        </Col>
      </Row>

      {/* Enrolled Courses */}
      <h5 className="mb-3">📚 Enrolled Courses</h5>
      {enrolled.length === 0 && (
        <p className="text-muted">No courses enrolled yet.</p>
      )}
      <Row xs={1} sm={2} className="g-3 mb-4">
        {enrolled.map(course => {
          const p = progress.find(p => p.courseId?._id === course._id)
          return (
            <Col key={course._id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title style={{ fontSize: 14 }}>{course.title}</Card.Title>
                  <Card.Text style={{ fontSize: 12, color: '#666' }}>
                    {course.description}
                  </Card.Text>
                  {p ? (
                    <Badge bg={p.completed ? 'success' : 'warning'}>
                      {p.completed ? '✅ Passed' : `📝 Score: ${p.quizScore}/${p.quizTotal}`}
                    </Badge>
                  ) : (
                    <Badge bg="secondary">📝 Quiz not attempted</Badge>
                  )}
                </Card.Body>
              </Card>
            </Col>
          )
        })}
      </Row>
    </Container>
  )
}