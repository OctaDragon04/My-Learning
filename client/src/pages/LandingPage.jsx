import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Container, Button, Row, Col, Card } from 'react-bootstrap'

export default function LandingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (user) {
    navigate(user.role === 'faculty' ? '/dashboard' : '/gallery')
    return null
  }

  return (
    <div>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0d6efd, #0a58ca)',
        color: 'white', padding: '80px 0', textAlign: 'center'
      }}>
        <Container>
          <h1 style={{ fontSize: 48, fontWeight: 'bold' }}>My Learning 🎓</h1>
          <p style={{ fontSize: 20, opacity: 0.9, marginBottom: 32 }}>
            A Smart E-Learning Platform for Students and Faculty
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Button
              variant="light"
              size="lg"
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
            <Button
              variant="outline-light"
              size="lg"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </div>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <h2 className="text-center mb-4">Why My Learning?</h2>
        <Row xs={1} sm={2} md={3} className="g-4">
          <Col>
            <Card className="h-100 shadow-sm text-center p-3">
              <div style={{ fontSize: 40 }}>📚</div>
              <Card.Title className="mt-2">Rich Course Library</Card.Title>
              <Card.Text style={{ fontSize: 13, color: '#666' }}>
                Access a wide range of courses created by expert faculty members.
              </Card.Text>
            </Card>
          </Col>
          <Col>
            <Card className="h-100 shadow-sm text-center p-3">
              <div style={{ fontSize: 40 }}>📝</div>
              <Card.Title className="mt-2">Interactive Quizzes</Card.Title>
              <Card.Text style={{ fontSize: 13, color: '#666' }}>
                Test your knowledge with quizzes and track your progress over time.
              </Card.Text>
            </Card>
          </Col>
          <Col>
            <Card className="h-100 shadow-sm text-center p-3">
              <div style={{ fontSize: 40 }}>🤖</div>
              <Card.Title className="mt-2">AI Learning Assistant</Card.Title>
              <Card.Text style={{ fontSize: 13, color: '#666' }}>
                Get instant help from our AI-powered chatbot for any learning questions.
              </Card.Text>
            </Card>
          </Col>
          <Col>
            <Card className="h-100 shadow-sm text-center p-3">
              <div style={{ fontSize: 40 }}>📊</div>
              <Card.Title className="mt-2">Progress Tracking</Card.Title>
              <Card.Text style={{ fontSize: 13, color: '#666' }}>
                Monitor your learning journey with detailed progress reports.
              </Card.Text>
            </Card>
          </Col>
          <Col>
            <Card className="h-100 shadow-sm text-center p-3">
              <div style={{ fontSize: 40 }}>👨‍🏫</div>
              <Card.Title className="mt-2">Expert Faculty</Card.Title>
              <Card.Text style={{ fontSize: 13, color: '#666' }}>
                Learn from experienced instructors who create quality content.
              </Card.Text>
            </Card>
          </Col>
          <Col>
            <Card className="h-100 shadow-sm text-center p-3">
              <div style={{ fontSize: 40 }}>🔒</div>
              <Card.Title className="mt-2">Secure Platform</Card.Title>
              <Card.Text style={{ fontSize: 13, color: '#666' }}>
                Your data is safe with our JWT-based authentication system.
              </Card.Text>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* CTA Section */}
      <div style={{ background: '#f8f9fa', padding: '60px 0', textAlign: 'center' }}>
        <Container>
          <h2 className="mb-3">Ready to Start Learning?</h2>
          <p className="text-muted mb-4">
            Join thousands of students and faculty members on My Learning today.
          </p>
          <Button variant="primary" size="lg" onClick={() => navigate('/register')}>
            Join Now — It's Free!
          </Button>
        </Container>
      </div>

      {/* Footer */}
      <div style={{ background: '#212529', color: '#aaa', padding: '20px 0', textAlign: 'center' }}>
        <p className="mb-0" style={{ fontSize: 13 }}>
          © 2026 My Learning — GLA University, Mathura | Built with MERN Stack
        </p>
      </div>
    </div>
  )
}