import { useState } from 'react'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../api/auth'
import { useAuth } from '../context/AuthContext'

const FACULTY_SECRET = 'FACULTY2024'

export default function Register() {
  const [step, setStep] = useState(1) // step 1: role selection, step 2: form
  const [role, setRole] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '', facultyCode: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole)
    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await registerUser({ ...form, role })
      login(res.data.token, res.data.user)
      navigate(res.data.user.role === 'faculty' ? '/dashboard' : '/')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className='d-flex justify-content-center align-items-center'
      style={{ minHeight: '90vh' }}>
      <Card style={{ width: 420 }} className='p-4 shadow'>

        {step === 1 && (
          <>
            <h4 className='text-center mb-2'>Join My Learning 🎓</h4>
            <p className='text-center text-muted mb-4'>Select your role to get started</p>
            <div className='d-flex gap-3'>
              <Button
                variant='outline-primary'
                className='w-50 py-4'
                onClick={() => handleRoleSelect('student')}
              >
                <div style={{ fontSize: 32 }}>🎓</div>
                <div className='mt-2 fw-bold'>Student</div>
                <div style={{ fontSize: 12, color: '#888' }}>Browse & enroll in courses</div>
              </Button>
              <Button
                variant='outline-success'
                className='w-50 py-4'
                onClick={() => handleRoleSelect('faculty')}
              >
                <div style={{ fontSize: 32 }}>👨‍🏫</div>
                <div className='mt-2 fw-bold'>Faculty</div>
                <div style={{ fontSize: 12, color: '#888' }}>Create & manage courses</div>
              </Button>
            </div>
            <p className='text-center mt-4 mb-0'>
              Already have an account? <Link to='/login'>Login</Link>
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <div className='d-flex align-items-center mb-3'>
              <Button variant='link' className='p-0 me-2' onClick={() => setStep(1)}>←</Button>
              <h5 className='mb-0'>
                {role === 'faculty' ? '👨‍🏫 Faculty' : '🎓 Student'} Registration
              </h5>
            </div>

            {error && <Alert variant='danger'>{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className='mb-3'>
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  placeholder='Enter your name'
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className='mb-3'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type='email'
                  placeholder='Enter your email'
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className='mb-3'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type='password'
                  placeholder='Create a password'
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
              </Form.Group>

              {role === 'faculty' && (
                <Form.Group className='mb-3'>
                  <Form.Label>Faculty Secret Code</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Enter faculty code'
                    value={form.facultyCode}
                    onChange={e => setForm({ ...form, facultyCode: e.target.value })}
                    required
                  />
                  <Form.Text className='text-muted'>Contact admin for the faculty code</Form.Text>
                </Form.Group>
              )}

              <Button type='submit' variant='dark' className='w-100' disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </Form>

            <p className='text-center mt-3 mb-0'>
              Already have an account? <Link to='/login'>Login</Link>
            </p>
          </>
        )}
      </Card>
    </Container>
  )
}