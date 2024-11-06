// src/components/layout/UserNavbar.jsx
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserNavbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand>Munlab</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate('/calendar')}>Calendario Attività</Nav.Link>
            <Nav.Link onClick={() => navigate('/my-bookings')}>Le Mie Prenotazioni</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link onClick={() => navigate('/profile')}>Profilo</Nav.Link>
            <Nav.Link onClick={() => {
              logout();
              navigate('/');
            }}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default UserNavbar;