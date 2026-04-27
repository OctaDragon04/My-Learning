import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to={user?.role === 'faculty' ? '/dashboard' : '/gallery'}>
        My Learning
      </Link>
      <div className="d-flex align-items-center gap-3">
        {user?.role === 'student' && (
          <>
            <Link className="text-white text-decoration-none" to="/gallery">Gallery</Link>
            <Link className="text-white text-decoration-none" to="/progress">Progress</Link>
            <Link className="text-white text-decoration-none" to="/profile">Profile</Link>
          </>
        )}
        {user?.role === 'faculty' && (
          <>
            <Link className="text-white text-decoration-none" to="/dashboard">Dashboard</Link>
            <Link className="text-white text-decoration-none" to="/faculty-profile">Profile</Link>
          </>
        )}
        <span className="text-white">Hi, {user?.name?.split(' ')[0]}!</span>
        <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}