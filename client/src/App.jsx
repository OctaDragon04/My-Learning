import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import StudentGallery from './pages/StudentGallery'
import FacultyDashboard from './pages/FacultyDashboard'

const role = 'faculty'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar role={role} />
      <Routes>
        <Route path='/' element={<StudentGallery />} />
        <Route path='/dashboard' element={<FacultyDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}