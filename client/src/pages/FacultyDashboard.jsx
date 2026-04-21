import { useEffect, useState } from 'react'
import { Container, Form, Button, ListGroup, Alert, Spinner } from 'react-bootstrap'
import { getCourses, addCourse, deleteCourse } from '../api/courses'

export default function FacultyDashboard() {
  const [courses, setCourses]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [success, setSuccess]   = useState('')
  const [form, setForm]         = useState({ title: '', description: '' })

  const load = () => getCourses().then(r => setCourses(r.data))

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await addCourse(form)
    setForm({ title: '', description: '' })
    setSuccess('Course added successfully!')
    load()
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleDelete = async (id) => {
    await deleteCourse(id)
    load()
  }

  if (loading) return <Spinner animation='border' className='m-4' />

  return (
    <Container className='py-4' style={{ maxWidth: 700 }}>
      <h4 className='mb-3'>Add new course</h4>
      {success && <Alert variant='success'>{success}</Alert>}
      <Form onSubmit={handleSubmit} className='mb-4'>
        <Form.Control
          className='mb-2'
          placeholder='Course title'
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
        />
        <Form.Control
          as='textarea'
          rows={3}
          className='mb-2'
          placeholder='Course description'
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
        <Button type='submit' variant='primary'>Add course</Button>
      </Form>

      <h5 className='mb-2'>Manage courses</h5>
      <ListGroup>
        {courses.map(c => (
          <ListGroup.Item key={c._id}
            className='d-flex justify-content-between align-items-center'>
            <span>{c.title}</span>
            <Button variant='outline-danger' size='sm'
              onClick={() => handleDelete(c._id)}>Delete</Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  )
}