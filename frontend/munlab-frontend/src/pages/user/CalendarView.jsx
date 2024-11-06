// src/pages/user/CalendarView.jsx
import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import UserLayout from '../../components/layout/UserLayout';

const CalendarView = () => {
  return (
    <UserLayout>
      <h2 className="mb-4">Calendario Attività</h2>
      <Row className="g-4">
        {/* Esempio di attività */}
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Laboratorio di Ceramica</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">15 Novembre 2024</Card.Subtitle>
              <Card.Text>
                Scopri l'arte della ceramica in questo laboratorio pratico.
              </Card.Text>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-primary">Posti: 8/10</span>
                <Button variant="primary">Prenota</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </UserLayout>
  );
};

export default CalendarView;