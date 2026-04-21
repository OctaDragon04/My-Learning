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
    <nav className='navbar navbar-dark bg-dark px-4'>
      <Link className='navbar-brand' to='/'>My Learning</Link>
      <div className='d-flex align-items-center gap-3'>
        <Link className='text-white text-decoration-none' to='/'>Gallery</Link>
        {user ? (
          <>
            {user.role === 'faculty' && (
              <Link className='text-white text-decoration-none' to='/dashboard'>Dashboard</Link>
            )}
            <span className='text-white'>Hi, {user.name.split(' ')[0]}!</span>
            <button className='btn btn-outline-light btn-sm' onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className='text-white text-decoration-none' to='/login'>Login</Link>
            <Link className='btn btn-outline-light btn-sm' to='/register'>Sign up</Link>
          </>
        )}
      </div>
    </nav>
  )
}