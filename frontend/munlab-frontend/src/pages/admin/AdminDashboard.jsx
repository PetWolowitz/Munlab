import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaCalendar, FaUsers, FaBookmark } from 'react-icons/fa';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalActivities: 0,
    totalBookings: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://127.0.0.1:8000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data);
      } catch (error) {
        console.error("Errore nel recupero delle statistiche:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, link, linkText }) => (
    <Card className="h-100 shadow-sm">
      <Card.Body className="text-center">
        <div className="display-4 mb-3 text-primary">
          <Icon />
        </div>
        <Card.Title>{title}</Card.Title>
        <div className="display-6 mb-3">{value}</div>
        <Button
          variant="primary"
          as={Link}
          to={link}
          className="rounded-pill"
        >
          {linkText}
        </Button>
      </Card.Body>
    </Card>
  );

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-sidebar">
          <nav>
            <Link to="/admin/activities" className="admin-nav-link">Attività</Link>
            <Link to="/admin/bookings" className="admin-nav-link">Prenotazioni</Link>
            <Link to="/admin/users" className="admin-nav-link">Utenti</Link>
          </nav>
        </div>
        <div className="admin-content d-flex justify-content-center align-items-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Caricamento...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <nav>
          <Link to="/admin/activities" className="admin-nav-link">Attività</Link>
          <Link to="/admin/bookings" className="admin-nav-link">Prenotazioni</Link>
          <Link to="/admin/users" className="admin-nav-link">Utenti</Link>
        </nav>
      </div>
      <div className="admin-content">
        <Container fluid>
          <h2 className="mb-4">Dashboard Amministrativa</h2>
          <Row className="g-4">
            <Col md={4}>
              <StatCard
                title="Attività Totali"
                value={stats.totalActivities}
                icon={FaCalendar}
                link="/admin/activities"
                linkText="Gestisci Attività"
              />
            </Col>
            <Col md={4}>
              <StatCard
                title="Prenotazioni Totali"
                value={stats.totalBookings}
                icon={FaBookmark}
                link="/admin/bookings"
                linkText="Visualizza Prenotazioni"
              />
            </Col>
            <Col md={4}>
              <StatCard
                title="Utenti Registrati"
                value={stats.totalUsers}
                icon={FaUsers}
                link="/admin/users"
                linkText="Gestisci Utenti"
              />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default AdminDashboard;