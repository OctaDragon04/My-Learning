import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import StudentGallery from './pages/StudentGallery'
import FacultyDashboard from './pages/FacultyDashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import QuizPage from './pages/QuizPage'
import StudentProgress from './pages/StudentProgress'
import StudentProfile from './pages/StudentProfile'
import FacultyProfile from './pages/FacultyProfile'
import CourseDetail from './pages/CourseDetail'
import Chatbot from './components/Chatbot'

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-4">Loading...</div>
  if (!user) return <Navigate to="/login" />
  if (role && user.role !== role) return <Navigate to="/" />
  return children
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={!user ? <LandingPage /> : <Navigate to={user.role === 'faculty' ? '/dashboard' : '/gallery'} />} />
        <Route path="/gallery" element={<StudentGallery />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/course/:courseId" element={<CourseDetail />} />
        <Route path="/quiz/:courseId" element={
          <ProtectedRoute role="student">
            <QuizPage />
          </ProtectedRoute>
        } />
        <Route path="/progress" element={
          <ProtectedRoute role="student">
            <StudentProgress />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute role="student">
            <StudentProfile />
          </ProtectedRoute>
        } />
        <Route path="/faculty-profile" element={
          <ProtectedRoute role="faculty">
            <FacultyProfile />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute role="faculty">
            <FacultyDashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={
          <div className="text-center py-5">
            <h1>404</h1>
            <p>Page not found</p>
            <a href="/">Go Home</a>
          </div>
        } />
      </Routes>
      {user && <Chatbot />}
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