import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaTools, FaGraduationCap, FaClock } from 'react-icons/fa';
import axios from 'axios';
import { motion } from 'framer-motion'; // Importa framer-motion
import '../../styles/layout.css';

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
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Container>
            <Row className="justify-content-center mb-5 ">
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
        </motion.div>
      </section>

      {/* Activities Section */}
      <section className="activities-section mt-3 shadow">
        <Container>
          <h2 className="text-center mb-5 text-Cus">Le Nostre Attività:</h2>
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
      <section className="section-container mt-1">
        <Container>
          <motion.h2 
            className="text-center mt-5 text-Cus"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            
          >
            Perché Scegliere Munlab?
          </motion.h2>
          <Row className="g-4 mt-3">
            {[
              { icon: <FaTools />, title: "Strumenti Professionali", text: "Attrezzature di alta qualità per la lavorazione dell'argilla" },
              { icon: <FaGraduationCap />, title: "Esperti del Settore", text: "Maestri ceramisti con anni di esperienza" },
              { icon: <FaClock />, title: "Flessibilità", text: "Orari personalizzabili e corsi su misura" },
            ].map((feature, index) => (
              <Col md={4} key={index}>
                <motion.div 
                  className="feature-card p-4 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  {feature.icon}
                  <h3 className="h5 mt-3">{feature.title}</h3>
                  <p>{feature.text}</p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section mt-5 glass-effect">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} className="text-center">
              <h4 className="mb-4">Non perderti neanche una delle nostre proposte:</h4>
              <Button className="newsletter-button">
                ISCRIVITI ALLA NEWSLETTER!
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer Section */}
      <footer className="footer py-5 mt-5 shadow">
        <Container>
          <Row className="mb-4">
            <Col md={4} className="mb-3">
              <p>Il Munlab è un progetto sostenuto da:</p>
              <Row>
                <Col xs={6}>
                  <img 
                    src="/partner-logos/Regione-Piemonte-logo.jpg" 
                    alt="Regione Piemonte" 
                    className="partner-logo img-fluid mb-2"
                  />
                  <img 
                    src="/partner-logos/Comune-Cambiano-logo.jpg" 
                    alt="Comune di Cambiano" 
                    className="partner-logo img-fluid mb-2"
                  />
                  <img 
                    src="/partner-logos/T2D-logo.png" 
                    alt="T2D logo" 
                    className="partner-logo img-fluid mb-2"
                  />
                </Col>
                <Col xs={6}>
                  <img 
                    src="/partner-logos/Rete-Ecomusei-Piemonte-logo.jpg" 
                    alt="Rete Ecomusei Piemonte" 
                    className="partner-logo img-fluid mb-2"
                  />
                  <img 
                    src="/partner-logos/Piemonte-ecomusei-logo.jpg" 
                    alt="Piemonte Ecomusei" 
                    className="partner-logo img-fluid mb-2"
                  />
                  <img 
                    src="/partner-logos/EMI-logo.jpg" 
                    alt="EMI logo" 
                    className="partner-logo img-fluid mb-2"
                  />
                </Col>
              </Row>
            </Col>

            <Col md={4} className="mb-3">
              <p>Il Munlab fa parte delle reti:</p>
              <Row>
                <Col xs={6}>
                  <img 
                    src="/partner-logos/Abbonamento-Musei-logo.jpg" 
                    alt="Abbonamento musei Piemonte" 
                    className="partner-logo img-fluid mb-2"
                  />
                  <img 
                    src="/partner-logos/Fondazione-Comunita-chierese-logo.jpg" 
                    alt="Fondazione della Comunità Chierese" 
                    className="partner-logo img-fluid mb-2"
                  />
                </Col>
                <Col xs={6}>
                  <img 
                    src="/partner-logos/Università-Torino-logo.jpg" 
                    alt="Università di Torino" 
                    className="partner-logo img-fluid mb-2"
                  />
                  <img 
                    src="/partner-logos/Dipartimento-Scienze-della-terra.jpg" 
                    alt="Dipartimento di Scienze della Terra" 
                    className="partner-logo img-fluid mb-2"
                  />
                </Col>
              </Row>
            </Col>

            <Col md={4} className="mb-3">
              <h6>Contatti:</h6>
              <p>Museo dell'Argilla</p>
              <p>Indirizzo: Via camporelle, 50 - 10090 Cambiano (TO)</p>
              <p>Email: info@munlabtorino.it</p>
              <p>Telefono: +39 011 944 14 39</p>
            </Col>
          </Row>

          <hr className="bg-white" />

          <Row>
            <Col md={6}>
              <p>&copy; {new Date().getFullYear()} Munlab - Ecomuseo dell'Argilla. Tutti i diritti riservati.</p>
            </Col>
            <Col md={6} className="text-md-end">
              <p>
                <a href="/privacy" className="text-white text-decoration-none">Privacy Policy</a> | 
                <a href="/terms" className="text-white text-decoration-none ms-2">Termini di Servizio</a>
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default PublicHome;
