import { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap'
import { getCourses } from '../api/courses'

export default function StudentGallery() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCourses()
      .then(res => setCourses(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner animation='border' className='m-4' />

  return (
    <Container className='py-4'>
      <h4 className='mb-3'>Course gallery</h4>
      <Row xs={1} sm={2} md={3} className='g-3'>
        {courses.map(course => (
          <Col key={course._id}>
            <Card className='h-100'>
              <Card.Body>
                <Card.Title style={{ fontSize: '15px' }}>{course.title}</Card.Title>
                <Card.Text style={{ fontSize: '13px', color: '#666' }}>
                  {course.description}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {courses.length === 0 &&
        <p style={{ color: '#888' }}>No courses yet. Faculty can add courses from the dashboard.</p>
      }
    </Container>
  )
}