import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Tab, Nav } from 'react-bootstrap';
import { FaCalendarPlus, FaUsersCog, FaClipboardList } from 'react-icons/fa';

const AdminDashboard = () => {
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activeTab, setActiveTab] = useState('activities');
  const [activityForm, setActivityForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    maxParticipants: '',
    price: ''
  });

  const handleAddActivity = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/activities/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          ...activityForm,
          datetime: `${activityForm.date}T${activityForm.time}`
        })
      });

      if (response.ok) {
        setShowActivityModal(false);
        // Aggiorna la lista delle attività
      }
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  return (
    <Container fluid className="py-4">
      <Tab.Container id="dashboard-tabs" activeKey={activeTab} onSelect={setActiveTab}>
        <Row>
          <Col md={3}>
            <Card className="mb-4">
              <Card.Body>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="activities">
                      <FaCalendarPlus className="me-2" />
                      Gestione Attività
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="bookings">
                      <FaClipboardList className="me-2" />
                      Prenotazioni
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="approvals">
                      <FaUsersCog className="me-2" />
                      Approvazioni Admin
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
          </Col>

          <Col md={9}>
            <Tab.Content>
              <Tab.Pane eventKey="activities">
                <Card>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h4>Gestione Attività</h4>
                      <Button onClick={() => setShowActivityModal(true)}>
                        + Nuova Attività
                      </Button>
                    </div>
                    
                    {/* Lista delle attività esistenti */}
                    <ActivityList />
                  </Card.Body>
                </Card>
              </Tab.Pane>

              <Tab.Pane eventKey="bookings">
                <Card>
                  <Card.Body>
                    <h4>Gestione Prenotazioni</h4>
                    {/* Lista delle prenotazioni */}
                    <BookingsList />
                  </Card.Body>
                </Card>
              </Tab.Pane>

              <Tab.Pane eventKey="approvals">
                <Card>
                  <Card.Body>
                    <h4>Approvazioni Admin in Attesa</h4>
                    {/* Lista degli admin da approvare */}
                    <AdminApprovalList />
                  </Card.Body>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>

      {/* Modal per aggiungere una nuova attività */}
      <Modal show={showActivityModal} onHide={() => setShowActivityModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Aggiungi Nuova Attività</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddActivity}>
            <Form.Group className="mb-3">
              <Form.Label>Titolo</Form.Label>
              <Form.Control
                type="text"
                value={activityForm.title}
                onChange={(e) => setActivityForm(prev => ({
                  ...prev,
                  title: e.target.value
                }))}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descrizione</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={activityForm.description}
                onChange={(e) => setActivityForm(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Data</Form.Label>
                  <Form.Control
                    type="date"
                    value={activityForm.date}
                    onChange={(e) => setActivityForm(prev => ({
                      ...prev,
                      date: e.target.value
                    }))}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ora</Form.Label>
                  <Form.Control
                    type="time"
                    value={activityForm.time}
                    onChange={(e) => setActivityForm(prev => ({
                      ...prev,
                      time: e.target.value
                    }))}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Numero massimo partecipanti</Form.Label>
                  <Form.Control
                    type="number"
                    value={activityForm.maxParticipants}
                    onChange={(e) => setActivityForm(prev => ({
                      ...prev,
                      maxParticipants: e.target.value
                    }))}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Prezzo</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={activityForm.price}
                    onChange={(e) => setActivityForm(prev => ({
                      ...prev,
                      price: e.target.value
                    }))}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="text-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowActivityModal(false)}>
                Annulla
              </Button>
              <Button type="submit">
                Aggiungi Attività
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;