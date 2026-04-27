import { useEffect, useState } from 'react'
import { Container, Form, Button, ListGroup, Alert, Spinner, Modal, Badge } from 'react-bootstrap'
import { getCourses, addCourse, deleteCourse, addQuiz, getQuizzes, updateCourse, deleteQuiz, generateSummary } from '../api/courses'
import { useAuth } from '../context/AuthContext'

export default function FacultyDashboard() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState('')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ title: '', description: '', contentUrl: '', notes: '', category: 'General' })

  // Edit modal
  const [showEdit, setShowEdit] = useState(false)
  const [editForm, setEditForm] = useState({ title: '', description: '', contentUrl: '', notes: '', category: 'General' })
  const [editId, setEditId] = useState(null)
  const [generatingSummary, setGeneratingSummary] = useState(false)

  // Quiz modal
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [quizForm, setQuizForm] = useState({ question: '', options: ['', '', '', ''], correctAnswer: 0 })
  const [quizzes, setQuizzes] = useState([])

  const categories = ['General', 'Programming', 'Mathematics', 'Science', 'Language', 'Business', 'Design']

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
    setForm({ title: '', description: '', contentUrl: '', notes: '', category: 'General' })
    setSuccess('Course added successfully!')
    load()
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      await deleteCourse(id)
      load()
    }
  }

  const openEditModal = (course) => {
    setEditId(course._id)
    setEditForm({
      title: course.title,
      description: course.description || '',
      contentUrl: course.contentUrl || '',
      notes: course.notes || '',
      category: course.category || 'General'
    })
    setShowEdit(true)
  }

  const handleEdit = async () => {
    await updateCourse(editId, editForm)
    setShowEdit(false)
    setSuccess('Course updated successfully!')
    load()
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleGenerateSummary = async () => {
    setGeneratingSummary(true)
    try {
      const res = await generateSummary({ title: editForm.title, description: editForm.description })
      setEditForm({ ...editForm, notes: res.data.summary })
    } catch (err) {
      console.error(err)
    } finally {
      setGeneratingSummary(false)
    }
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

  const handleDeleteQuiz = async (id) => {
    if (window.confirm('Delete this question?')) {
      await deleteQuiz(id)
      const res = await getQuizzes(selectedCourse._id)
      setQuizzes(res.data)
    }
  }

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <Spinner animation="border" className="m-4" />

  return (
    <Container className="py-4" style={{ maxWidth: 700 }}>
      <h4 className="mb-3">Add New Course</h4>
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Control
          className="mb-2"
          placeholder="Course title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
        />
        <Form.Control
          as="textarea"
          rows={3}
          className="mb-2"
          placeholder="Course description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
        <Form.Select
          className="mb-2"
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </Form.Select>
        <Form.Control
          className="mb-2"
          placeholder="Content URL (YouTube video or PDF link)"
          value={form.contentUrl}
          onChange={e => setForm({ ...form, contentUrl: e.target.value })}
        />
        <Form.Control
          as="textarea"
          rows={2}
          className="mb-2"
          placeholder="Course notes (optional)"
          value={form.notes}
          onChange={e => setForm({ ...form, notes: e.target.value })}
        />
        <Button type="submit" variant="primary">Add Course</Button>
      </Form>

      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">Manage Courses ({filteredCourses.length})</h5>
        <input
          className="form-control form-control-sm"
          style={{ width: 200 }}
          placeholder="Search courses..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <ListGroup>
        {filteredCourses.map(c => (
          <ListGroup.Item key={c._id}
            className="d-flex justify-content-between align-items-center">
            <div>
              <span>{c.title}</span>
              {c.category && <Badge bg="secondary" className="ms-2" style={{ fontSize: 10 }}>{c.category}</Badge>}
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-success" size="sm" onClick={() => openEditModal(c)}>✏️ Edit</Button>
              <Button variant="outline-primary" size="sm" onClick={() => openQuizModal(c)}>📝 Quiz</Button>
              <Button variant="outline-danger" size="sm" onClick={() => handleDelete(c._id)}>Delete</Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Edit Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>✏️ Edit Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control className="mb-2" placeholder="Course title"
            value={editForm.title}
            onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
          <Form.Control as="textarea" rows={3} className="mb-2" placeholder="Course description"
            value={editForm.description}
            onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
          <Form.Select className="mb-2" value={editForm.category}
            onChange={e => setEditForm({ ...editForm, category: e.target.value })}>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </Form.Select>
          <Form.Control className="mb-2" placeholder="Content URL"
            value={editForm.contentUrl}
            onChange={e => setEditForm({ ...editForm, contentUrl: e.target.value })} />
          <div className="d-flex gap-2 mb-2">
            <Form.Control as="textarea" rows={3} placeholder="Course notes / AI Summary"
              value={editForm.notes}
              onChange={e => setEditForm({ ...editForm, notes: e.target.value })} />
          </div>
          <Button variant="outline-primary" size="sm"
            onClick={handleGenerateSummary}
            disabled={generatingSummary}>
            {generatingSummary ? '⏳ Generating...' : '🤖 Generate AI Summary'}
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>Cancel</Button>
          <Button variant="success" onClick={handleEdit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      {/* Quiz Modal */}
      <Modal show={showQuiz} onHide={() => setShowQuiz(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>📝 Quiz — {selectedCourse?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>Existing Questions ({quizzes.length})</h6>
          {quizzes.length === 0 && <p className="text-muted">No questions yet</p>}
          <ListGroup className="mb-4">
            {quizzes.map((q, i) => (
              <ListGroup.Item key={q._id} className="d-flex justify-content-between align-items-center">
                <span><strong>Q{i + 1}:</strong> {q.question}</span>
                <Button variant="outline-danger" size="sm" onClick={() => handleDeleteQuiz(q._id)}>🗑️</Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <h6>Add New Question</h6>
          <Form.Control className="mb-2" placeholder="Enter question"
            value={quizForm.question}
            onChange={e => setQuizForm({ ...quizForm, question: e.target.value })} />
          {quizForm.options.map((opt, i) => (
            <Form.Control key={i} className="mb-2" placeholder={`Option ${i + 1}`}
              value={opt} onChange={e => handleOptionChange(i, e.target.value)} />
          ))}
          <Form.Select className="mb-3" value={quizForm.correctAnswer}
            onChange={e => setQuizForm({ ...quizForm, correctAnswer: Number(e.target.value) })}>
            <option value={0}>Correct Answer: Option 1</option>
            <option value={1}>Correct Answer: Option 2</option>
            <option value={2}>Correct Answer: Option 3</option>
            <option value={3}>Correct Answer: Option 4</option>
          </Form.Select>
          <Button variant="success" onClick={handleAddQuiz}>Add Question</Button>
        </Modal.Body>
      </Modal>
    </Container>
  )
}