import axios from 'axios'

export const registerUser = (data) => axios.post('/api/auth/register', data)
export const loginUser    = (data) => axios.post('/api/auth/login', data)
export const getMe        = ()     => axios.get('/api/auth/me', {
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})