import { useEffect, useState } from 'react'
import { Container, Card, Row, Col, Badge, Spinner, Button } from 'react-bootstrap'
import { getCourses } from '../api/courses'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function FacultyProfile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCourses()
      .then(res => {
        const myCourses = res.data.filter(c => c.instructorId === user?.id)
        setCourses(myCourses)
      })
      .finally(() => setLoading(false))
  }, [user])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (loading) return <Spinner animation="border" className="m-4" />

  return (
    <Container className="py-4" style={{ maxWidth: 700 }}>
      {/* Profile Card */}
      <Card className="p-4 mb-4 shadow-sm">
        <div className="d-flex align-items-center gap-4">
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: '#198754', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, fontWeight: 'bold'
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="mb-1">{user?.name}</h4>
            <p className="text-muted mb-1">{user?.email}</p>
            <Badge bg="success">👨‍🏫 Faculty</Badge>
          </div>
          <Button variant="outline-danger" size="sm" className="ms-auto"
            onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <Row className="g-3 mb-4">
        <Col xs={6}>
          <Card className="text-center p-3 shadow-sm">
            <h3 className="text-success">{courses.length}</h3>
            <p className="text-muted mb-0" style={{ fontSize: 13 }}>Courses Created</p>
          </Card>
        </Col>
        <Col xs={6}>
          <Card className="text-center p-3 shadow-sm">
            <h3 className="text-primary">
              {courses.filter(c => c.contentUrl).length}
            </h3>
            <p className="text-muted mb-0" style={{ fontSize: 13 }}>With Content</p>
          </Card>
        </Col>
      </Row>

      {/* My Courses */}
      <h5 className="mb-3">📚 My Courses</h5>
      {courses.length === 0 && (
        <p className="text-muted">No courses created yet. Go to Dashboard to add courses!</p>
      )}
      <Row xs={1} sm={2} className="g-3">
        {courses.map(course => (
          <Col key={course._id}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title style={{ fontSize: 14 }}>{course.title}</Card.Title>
                <Card.Text style={{ fontSize: 12, color: '#666' }}>
                  {course.description}
                </Card.Text>
                {course.category && <Badge bg="secondary">{course.category}</Badge>}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}