// src/components/layout/UserLayout.jsx
import React from 'react';
import { Container } from 'react-bootstrap';
import UserNavbar from './UserNavbar';

const UserLayout = ({ children }) => {
  return (
    <div className="min-vh-100 bg-light">
      <UserNavbar />
      <Container className="py-4">
        {children}
      </Container>
    </div>
  );
};

export default UserLayout;