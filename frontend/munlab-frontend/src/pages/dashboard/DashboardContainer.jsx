import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import AnimatedAlert from '../../components/AnimatedAlert';

const UserDashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Container fluid className="py-4">
        <Card className="auth-card">
          <Card.Body className="p-4">
            <h3 className="text-center mb-4">Dashboard Utente</h3>
            <Row>
              <Col md={6} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>Calendario Attività</Card.Title>
                    <div className="mt-3">
                      <p className="text-muted">Visualizza le prossime attività</p>
                      {/* Qui integreremo il calendario */}
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>Sistema di Prenotazione</Card.Title>
                    <div className="mt-3">
                      <p className="text-muted">Gestisci le tue prenotazioni</p>
                      {/* Qui integreremo le prenotazioni */}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </motion.div>
  );
};

const AdminDashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Container fluid className="py-4">
        <Card className="auth-card">
          <Card.Body className="p-4">
            <h3 className="text-center mb-4">Dashboard Amministratore</h3>
            <Row>
              <Col lg={4} md={6} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>Approvazioni Admin</Card.Title>
                    <div className="mt-3">
                      <p className="text-muted">Gestisci le approvazioni degli altri admin</p>
                      {/* Qui integreremo le approvazioni */}
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={4} md={6} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>Gestione Attività</Card.Title>
                    <div className="mt-3">
                      <p className="text-muted">Gestisci le attività del museo</p>
                      {/* Qui integreremo la gestione attività */}
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={4} md={6} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>Visualizza Prenotazioni</Card.Title>
                    <div className="mt-3">
                      <p className="text-muted">Monitora le prenotazioni</p>
                      {/* Qui integreremo la visualizzazione prenotazioni */}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </motion.div>
  );
};

const DashboardContainer = () => {
  const [userType, setUserType] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUserType = localStorage.getItem('user_type');
    if (storedUserType) {
      setUserType(storedUserType);
    } else {
      setError('Sessione non valida. Effettua nuovamente il login.');
    }
  }, []);

  if (error) {
    return (
      <Container fluid className="py-4">
        <AnimatedAlert show={true} variant="danger" onClose={() => setError('')}>
          {error}
        </AnimatedAlert>
      </Container>
    );
  }

  return userType === 'admin' ? <AdminDashboard /> : <UserDashboard />;
};

export default DashboardContainer;