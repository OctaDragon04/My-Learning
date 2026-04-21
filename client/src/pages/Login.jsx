import { useState } from 'react'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await axios.post('/api/auth/login', form)
      login(res.data.token, res.data.user)
      navigate(res.data.user.role === 'faculty' ? '/dashboard' : '/')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className='d-flex justify-content-center align-items-center'
      style={{ minHeight: '90vh' }}>
      <Card style={{ width: 420 }} className='p-4 shadow'>
        <h4 className='text-center mb-4'>Welcome Back 👋</h4>

        {error && <Alert variant='danger'>{error}</Alert>}

        <Form onSubmit={handleSubmit}>
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
              placeholder='Enter your password'
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </Form.Group>
          <Button type='submit' variant='dark' className='w-100' disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Form>

        <p className='text-center mt-3 mb-0'>
          Don't have an account? <Link to='/register'>Sign up</Link>
        </p>
      </Card>
    </Container>
  )
}