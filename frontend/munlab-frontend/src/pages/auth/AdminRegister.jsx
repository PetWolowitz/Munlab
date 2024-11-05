import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { validateField, validatePassword } from '../../utils/validationUtils';
import '../../styles/adminRegister.css';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    employeeId: '',
    role: '',
    department: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [generalError, setGeneralError] = useState('');
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validazione in tempo reale
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'confirmPassword') {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    const passwordError = validatePassword(formData.password, formData.confirmPassword);
    if (passwordError) newErrors.confirmPassword = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessMessage('');

    if (!validateForm()) {
      setGeneralError('Per favore, correggi gli errori nel form prima di procedere.');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register({
        ...formData,
        user_type: 'admin'
      });

      setSuccessMessage(
        'Registrazione effettuata con successo! La tua richiesta è in attesa di approvazione da parte del super admin. ' +
        'Riceverai una notifica quando il tuo account sarà stato approvato.'
      );

      // Dopo 3 secondi, reindirizza alla pagina di login
      setTimeout(() => {
        navigate('/auth');
      }, 3000);

    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setGeneralError(
          err.response?.data?.message || 
          'Errore durante la registrazione. Riprova più tardi.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center"
               style={{ background: 'var(--background-color)' }}>
      <Card className="border-0 shadow-sm" style={{ maxWidth: '600px', width: '100%' }}>
        <Card.Body className="p-4">
          <h3 className="text-center mb-4" style={{ color: 'var(--primary-color)' }}>
            Registrazione Amministratore
          </h3>

          {generalError && (
            <Alert variant="danger" className="mb-4" dismissible onClose={() => setGeneralError('')}>
              {generalError}
            </Alert>
          )}

          {successMessage && (
            <Alert variant="success" className="mb-4">
              {successMessage}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    isInvalid={!!errors.firstName}
                    required
                    className="rounded-pill"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.firstName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Cognome</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    isInvalid={!!errors.lastName}
                    required
                    className="rounded-pill"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.lastName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email Istituzionale</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    isInvalid={!!errors.email}
                    required
                    className="rounded-pill"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>ID Dipendente</Form.Label>
                  <Form.Control
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    isInvalid={!!errors.employeeId}
                    required
                    className="rounded-pill"
                    placeholder="Es. EMP123"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.employeeId}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    isInvalid={!!errors.username}
                    required
                    className="rounded-pill"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Ruolo</Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    isInvalid={!!errors.role}
                    required
                    className="rounded-pill"
                  >
                    <option value="">Seleziona ruolo</option>
                    <option value="manager">Manager</option>
                    <option value="operator">Operatore</option>
                    <option value="guide">Guida Museale</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.role}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    isInvalid={!!errors.password}
                    required
                    className="rounded-pill"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Conferma Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    isInvalid={!!errors.confirmPassword}
                    required
                    className="rounded-pill"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-grid gap-2">
              <Button
                type="submit"
                className="rounded-pill"
                disabled={loading}
                style={{
                  backgroundColor: 'var(--primary-color)',
                  border: 'none'
                }}
              >
                {loading ? 'Registrazione in corso...' : 'Registrati come Amministratore'}
              </Button>

              <Button
                variant="link"
                onClick={() => navigate('/auth')}
                className="text-muted"
              >
                Torna al login
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminRegister;