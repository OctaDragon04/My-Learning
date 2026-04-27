import { useEffect, useState } from 'react'
import { Container, Card, Row, Col, ProgressBar, Spinner, Badge } from 'react-bootstrap'
import { getProgress } from '../api/courses'
import { useAuth } from '../context/AuthContext'

export default function StudentProgress() {
  const { user } = useAuth()
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      getProgress(user.id)
        .then(res => setProgress(res.data))
        .finally(() => setLoading(false))
    }
  }, [user])

  if (loading) return <Spinner animation='border' className='m-4' />

  const completed = progress.filter(p => p.completed).length
  const total = progress.length

  return (
    <Container className='py-4'>
      <h4 className='mb-4'>📊 My Progress</h4>

      {/* Summary Card */}
      <Card className='p-4 mb-4 shadow-sm'>
        <Row>
          <Col className='text-center'>
            <h2 className='text-primary'>{total}</h2>
            <p className='text-muted mb-0'>Quizzes Attempted</p>
          </Col>
          <Col className='text-center'>
            <h2 className='text-success'>{completed}</h2>
            <p className='text-muted mb-0'>Quizzes Passed</p>
          </Col>
          <Col className='text-center'>
            <h2 className='text-warning'>{total - completed}</h2>
            <p className='text-muted mb-0'>Need Improvement</p>
          </Col>
        </Row>
      </Card>

      {/* Progress List */}
      {progress.length === 0 && (
        <p className='text-muted'>No quiz attempts yet. Enroll in a course and take a quiz!</p>
      )}

      <Row xs={1} sm={2} md={3} className='g-3'>
        {progress.map(p => (
          <Col key={p._id}>
            <Card className='h-100 shadow-sm'>
              <Card.Body>
                <Card.Title style={{ fontSize: 15 }}>
                  {p.courseId?.title || 'Course'}
                </Card.Title>
                <div className='d-flex justify-content-between mb-2'>
                  <span style={{ fontSize: 13 }}>Score: {p.quizScore}/{p.quizTotal}</span>
                  <Badge bg={p.completed ? 'success' : 'warning'}>
                    {p.completed ? '✅ Passed' : '📚 Try Again'}
                  </Badge>
                </div>
                <ProgressBar
                  now={(p.quizScore / p.quizTotal) * 100}
                  variant={p.completed ? 'success' : 'warning'}
                />
                <p style={{ fontSize: 11, color: '#888', marginTop: 8 }}>
                  Last attempt: {new Date(p.attemptedAt).toLocaleDateString()}
                </p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}