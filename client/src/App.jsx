import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Chatbot from './components/Chatbot'
import StudentGallery from './pages/StudentGallery'
import FacultyDashboard from './pages/FacultyDashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import QuizPage from './pages/QuizPage'

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return <div className='p-4'>Loading...</div>
  if (!user) return <Navigate to='/login' />
  if (role && user.role !== role) return <Navigate to='/' />
  return children
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<StudentGallery />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/quiz/:courseId' element={
          <ProtectedRoute role='student'>
            <QuizPage />
          </ProtectedRoute>
        } />
        <Route path='/dashboard' element={
          <ProtectedRoute role='faculty'>
            <FacultyDashboard />
          </ProtectedRoute>
        } />
      </Routes>
      <Chatbot />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}