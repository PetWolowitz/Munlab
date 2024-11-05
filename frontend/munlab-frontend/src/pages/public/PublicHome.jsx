import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const PublicHome = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center justify-content-center text-center">
            <Col lg={8} md={10}>
              <h1 className="display-4 fw-bold mb-3">Munlab</h1>
              <h2 className="h3 mb-4">Museo dell'Argilla</h2>
              <p className="lead mb-4">
                Scopri l'arte della terracotta attraverso laboratori interattivi ed esperienze uniche
              </p>
              <Button 
                variant="light" 
                size="lg"
                onClick={() => navigate('/auth')}
                className="px-4 py-2"
              >
                Inizia l'Esperienza
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="section-container">
        <Container>
          <h2 className="text-center mb-5">Le Nostre Attività</h2>
          <Row className="g-4">
            {[
              {
                title: 'Laboratori Didattici',
                description: 'Esplora l\'arte della ceramica con i nostri esperti',
                icon: '🎨'
              },
              {
                title: 'Visite Guidate',
                description: 'Scopri la storia e le tecniche della lavorazione',
                icon: '🏺'
              },
              {
                title: 'Workshop Speciali',
                description: 'Partecipa a eventi esclusivi con artisti internazionali',
                icon: '✨'
              }
            ].map((feature, index) => (
              <Col key={index} md={6} lg={4}>
                <Card className="feature-card h-100 text-center p-4">
                  <Card.Body>
                    <div className="display-4 mb-3">{feature.icon}</div>
                    <Card.Title className="h4 mb-3">{feature.title}</Card.Title>
                    <Card.Text>{feature.description}</Card.Text>
                    <Button 
                      variant="outline-primary"
                      onClick={() => navigate('/auth')}
                      className="mt-3"
                    >
                      Prenota
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Info Section */}
      <section className="section-container bg-light">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h2 className="mb-4">Perché Scegliere Munlab?</h2>
              <Row className="g-4">
                {[
                  { title: 'Esperienza', text: 'Istruttori qualificati', icon: '👨‍🏫' },
                  { title: 'Attrezzature', text: 'Strumenti professionali', icon: '🔨' },
                  { title: 'Flessibilità', text: 'Orari personalizzabili', icon: '📅' }
                ].map((item, index) => (
                  <Col key={index} md={4}>
                    <div className="p-4">
                      <div className="display-4 mb-3">{item.icon}</div>
                      <h3 className="h5 mb-2">{item.title}</h3>
                      <p className="text-muted mb-0">{item.text}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-4 bg-dark text-white">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} className="text-center">
              <h5 className="mb-3">Munlab - Museo dell'Argilla</h5>
              <p className="mb-1">Email: info@munlab.it</p>
              <p className="mb-1">Tel: +39 011 234567</p>
              <small className="d-block mt-3">© 2024 Munlab - Tutti i diritti riservati</small>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default PublicHome;