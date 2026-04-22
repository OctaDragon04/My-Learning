import { useEffect, useState } from 'react'
import { Container, Form, Button, ListGroup, Alert, Spinner, Modal } from 'react-bootstrap'
import { getCourses, addCourse, deleteCourse, addQuiz, getQuizzes } from '../api/courses'
import { useAuth } from '../context/AuthContext'

export default function FacultyDashboard() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({ title: '', description: '' })

  // Quiz modal
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [quizForm, setQuizForm] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  })
  const [quizzes, setQuizzes] = useState([])

  const load = () => getCourses().then(r => setCourses(r.data))

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await addCourse({
      ...form,
      instructorId: user?.id || 'unknown',
      instructorName: user?.name || 'Faculty'
    })
    setForm({ title: '', description: '' })
    setSuccess('Course added successfully!')
    load()
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleDelete = async (id) => {
    await deleteCourse(id)
    load()
  }

  const openQuizModal = async (course) => {
    setSelectedCourse(course)
    const res = await getQuizzes(course._id)
    setQuizzes(res.data)
    setShowQuiz(true)
  }

  const handleOptionChange = (i, value) => {
    const opts = [...quizForm.options]
    opts[i] = value
    setQuizForm({ ...quizForm, options: opts })
  }

  const handleAddQuiz = async () => {
    await addQuiz({ ...quizForm, courseId: selectedCourse._id })
    const res = await getQuizzes(selectedCourse._id)
    setQuizzes(res.data)
    setQuizForm({ question: '', options: ['', '', '', ''], correctAnswer: 0 })
    setSuccess('Quiz added!')
    setTimeout(() => setSuccess(''), 2000)
  }

  if (loading) return <Spinner animation='border' className='m-4' />

  return (
    <Container className='py-4' style={{ maxWidth: 700 }}>
      <h4 className='mb-3'>Add New Course</h4>
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
        <Button type='submit' variant='primary'>Add Course</Button>
      </Form>

      <h5 className='mb-2'>Manage Courses</h5>
      <ListGroup>
        {courses.map(c => (
          <ListGroup.Item key={c._id}
            className='d-flex justify-content-between align-items-center'>
            <span>{c.title}</span>
            <div className='d-flex gap-2'>
              <Button variant='outline-primary' size='sm'
                onClick={() => openQuizModal(c)}>
                📝 Quiz
              </Button>
              <Button variant='outline-danger' size='sm'
                onClick={() => handleDelete(c._id)}>
                Delete
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Quiz Modal */}
      <Modal show={showQuiz} onHide={() => setShowQuiz(false)} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>📝 Quiz — {selectedCourse?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>Existing Questions ({quizzes.length})</h6>
          {quizzes.length === 0 && <p className='text-muted'>No questions yet</p>}
          <ListGroup className='mb-4'>
            {quizzes.map((q, i) => (
              <ListGroup.Item key={q._id}>
                <strong>Q{i + 1}:</strong> {q.question}
              </ListGroup.Item>
            ))}
          </ListGroup>

          <h6>Add New Question</h6>
          <Form.Control
            className='mb-2'
            placeholder='Enter question'
            value={quizForm.question}
            onChange={e => setQuizForm({ ...quizForm, question: e.target.value })}
          />
          {quizForm.options.map((opt, i) => (
            <Form.Control
              key={i}
              className='mb-2'
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={e => handleOptionChange(i, e.target.value)}
            />
          ))}
          <Form.Select
            className='mb-3'
            value={quizForm.correctAnswer}
            onChange={e => setQuizForm({ ...quizForm, correctAnswer: Number(e.target.value) })}
          >
            <option value={0}>Correct Answer: Option 1</option>
            <option value={1}>Correct Answer: Option 2</option>
            <option value={2}>Correct Answer: Option 3</option>
            <option value={3}>Correct Answer: Option 4</option>
          </Form.Select>
          <Button variant='success' onClick={handleAddQuiz}>Add Question</Button>
        </Modal.Body>
      </Modal>
    </Container>
  )
}