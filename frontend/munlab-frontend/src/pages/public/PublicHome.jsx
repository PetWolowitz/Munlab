import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaTools, FaGraduationCap, FaClock } from 'react-icons/fa';
import axios from 'axios';

const PublicHome = () => {
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/activities/');
        setActivities(response.data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <Container>
            <Row className="justify-content-center text-center">
              <Col md={8}>
                <h1 className="display-4 fw-bold mb-4">Munlab</h1>
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
                  Scopri le Attività
                </Button>
              </Col>
            </Row>
          </Container>
        </div>
      </section>

      {/* Activities Section */}
      <section className="activities-section">
        <Container>
          <h2 className="text-center mb-5">Le Nostre Attività</h2>
          <Row className="g-4">
            {activities.map((activity) => (
              <Col md={4} key={activity.id}>
                <Card className="activity-card h-100">
                  {activity.immagine && (
                    <Card.Img 
                      variant="top" 
                      src={`http://127.0.0.1:8000${activity.immagine}`}
                      className="activity-image"
                      alt={activity.nome}
                    />
                  )}
                  <Card.Body>
                    <Card.Title>{activity.nome}</Card.Title>
                    <Card.Text>{activity.descrizione}</Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">€{activity.costo}</span>
                      <Button 
                        variant="primary"
                        onClick={() => navigate('/auth')}
                      >
                        Prenota
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-container bg-light">
        <Container>
          <h2 className="text-center mb-5">Perché Scegliere Munlab</h2>
          <Row className="g-4">
            <Col md={4}>
              <div className="feature-card p-4 text-center">
                <FaTools className="display-4 mb-3 text-primary" />
                <h3 className="h5">Strumenti Professionali</h3>
                <p>Attrezzature di alta qualità per la lavorazione dell'argilla</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="feature-card p-4 text-center">
                <FaGraduationCap className="display-4 mb-3 text-primary" />
                <h3 className="h5">Esperti del Settore</h3>
                <p>Maestri ceramisti con anni di esperienza</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="feature-card p-4 text-center">
                <FaClock className="display-4 mb-3 text-primary" />
                <h3 className="h5">Flessibilità</h3>
                <p>Orari personalizzabili e corsi su misura</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} className="text-center">
              <h3 className="mb-4">Non perderti neanche una delle nostre proposte:</h3>
              <Button className="newsletter-button">
                ISCRIVITI ALLA NEWSLETTER!
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Partners Section */}
      <section className="partners-section">
        <Container>
          <h3 className="text-center mb-4">Il Munlab è un progetto sostenuto da</h3>
          <Row className="justify-content-center align-items-center g-4">
            <Col xs={6} md={3} lg={2}>
              <img 
                src="/partner-logos/regione-piemonte.png" 
                alt="Regione Piemonte" 
                className="partner-logo img-fluid"
              />
            </Col>
            {/* Aggiungi altri partner qui */}
          </Row>
          <div className="text-center mt-5">
            <h3 className="mb-4">Il Munlab è parte delle reti</h3>
            {/* Aggiungi le reti qui */}
          </div>
          <div className="text-center mt-5">
            <h3 className="mb-4">Il Munlab collabora stabilmente con</h3>
            {/* Aggiungi i collaboratori qui */}
          </div>
        </Container>
      </section>
    </div>
  );
};

export default PublicHome;