import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const PublicHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleActionClick = () => {
    if (user) {
      // Se l'utente è già loggato, vai direttamente alla prenotazione
      navigate('/bookings');
    } else {
      // Altrimenti mostra il modal di login
      setShowLoginModal(true);
    }
  };

  const handleLoginClick = () => {
    setShowLoginModal(false);
    navigate('/auth');
  };

  return (
    <div className="public-home">
      {/* Header con sfondo in terracotta */}
      <div 
        className="header-banner" 
        style={{ 
          background: 'var(--primary-color)',
          padding: '4rem 0',
          marginBottom: '2rem'
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-white">
              <h1 className="display-4 fw-bold">Munlab</h1>
              <h2 className="h3 mb-4">Museo dell'Argilla</h2>
              <p className="lead mb-4">
                Scopri l'arte della terracotta attraverso laboratori interattivi ed esperienze uniche
              </p>
              <Button 
                variant="light" 
                size="lg"
                onClick={handleActionClick}
                className="px-4 py-2"
              >
                Prenota un'Attività
              </Button>
            </Col>
            <Col md={6} className="d-none d-md-block">
              {/* Placeholder per un'immagine o decorazione */}
              <div 
                className="text-center"
                style={{
                  background: 'var(--secondary-color)',
                  height: '300px',
                  borderRadius: '10px',
                  opacity: '0.9'
                }}
              >
                {/* Qui potrebbe andare un'immagine del museo */}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Sezione Attività */}
      <Container className="my-5">
        <h2 className="text-center mb-5">Le Nostre Attività</h2>
        <Row>
          {/* Card Attività */}
          {['Laboratorio Base', 'Corso Avanzato', 'Workshop Speciale'].map((activity, index) => (
            <Col md={4} key={index} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Img 
                  variant="top" 
                  src={`/placeholder-${index + 1}.jpg`}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{activity}</Card.Title>
                  <Card.Text>
                    Scopri le tecniche di lavorazione dell'argilla in questo corso interattivo.
                  </Card.Text>
                  <Button 
                    variant="outline-primary"
                    onClick={handleActionClick}
                  >
                    Prenota
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Sezione Info */}
      <div 
        className="info-section py-5"
        style={{ background: 'var(--background-color)' }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col md={8} className="text-center">
              <h2 className="mb-4">Perché Scegliere Munlab?</h2>
              <Row className="g-4">
                {[
                  { title: 'Esperienza', text: 'Istruttori qualificati' },
                  { title: 'Attrezzature', text: 'Strumenti professionali' },
                  { title: 'Flessibilità', text: 'Orari personalizzabili' }
                ].map((item, index) => (
                  <Col md={4} key={index}>
                    <div className="p-3">
                      <h3 className="h5">{item.title}</h3>
                      <p className="text-muted">{item.text}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Modal Login */}
      <Modal 
        show={showLoginModal} 
        onHide={() => setShowLoginModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Accedi per Prenotare</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Per prenotare un'attività è necessario accedere al tuo account.</p>
          <div className="d-grid gap-2">
            <Button 
              variant="primary" 
              onClick={handleLoginClick}
            >
              Accedi o Registrati
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Footer */}
      <footer 
        className="footer py-4 mt-5"
        style={{ 
          background: 'var(--primary-color)',
          color: 'white'
        }}
      >
        <Container>
          <Row>
            <Col md={4}>
              <h5>Munlab</h5>
              <p>Museo dell'Argilla</p>
            </Col>
            <Col md={4}>
              <h5>Contatti</h5>
              <p>Email: info@munlab.it</p>
              <p>Tel: +39 011 234567</p>
            </Col>
            <Col md={4}>
              <h5>Orari</h5>
              <p>Lun-Ven: 9:00 - 18:00</p>
              <p>Sab-Dom: 10:00 - 16:00</p>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col className="text-center">
              <small>© 2024 Munlab - Tutti i diritti riservati</small>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default PublicHome;