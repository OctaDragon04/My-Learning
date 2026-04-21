import { Link } from 'react-router-dom'
import { Navbar, Nav, Container } from 'react-bootstrap'

export default function AppNavbar({ role }) {
  return (
    <Navbar bg='dark' variant='dark' expand='sm'>
      <Container>
        <Navbar.Brand as={Link} to='/'>My Learning</Navbar.Brand>
        <Nav>
          <Nav.Link as={Link} to='/'>Gallery</Nav.Link>
          {role === 'faculty' &&
            <Nav.Link as={Link} to='/dashboard'>Dashboard</Nav.Link>
          }
        </Nav>
      </Container>
    </Navbar>
  )
}