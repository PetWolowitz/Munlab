import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import authService from '../../services/authService';
import { socialAuthService } from '../../services/socialAuthService';
import { validateField, validatePassword } from '../../utils/validationUtils';

const UserRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

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

    if (!validateForm()) {
      setGeneralError('Per favore, correggi gli errori nel form prima di procedere.');
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        ...formData,
        user_type: 'user'
      });
      navigate('/auth');
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setGeneralError(err.response?.data?.message || 'Errore durante la registrazione');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await socialAuthService.handleGoogleLogin(credentialResponse.credential);
      navigate('/');
    } catch (error) {
      setGeneralError('Errore durante l\'accesso con Google');
    }
  };

  const handleFacebookLogin = async () => {
    window.FB.login(async function(response) {
      if (response.authResponse) {
        try {
          await socialAuthService.handleFacebookLogin(response.authResponse);
          navigate('/');
        } catch (error) {
          setGeneralError('Errore durante l\'accesso con Facebook');
        }
      }
    }, {scope: 'email'});
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center"
               style={{ background: 'var(--background-color)' }}>
      <Card className="border-0 shadow-sm" style={{ maxWidth: '500px', width: '100%' }}>
        <Card.Body className="p-4">
          <h3 className="text-center mb-4" style={{ color: 'var(--primary-color)' }}>
            Registrazione Visitatore
          </h3>

          {generalError && (
            <Alert variant="danger" className="mb-4" dismissible onClose={() => setGeneralError('')}>
              {generalError}
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

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
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

            <Form.Group className="mb-3">
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

            <Form.Group className="mb-3">
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

            <Form.Group className="mb-4">
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

            <div className="mb-4">
              <div className="text-center mb-3">
                <span>oppure registrati con</span>
              </div>
              <div className="d-grid gap-2">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setGeneralError('Errore durante l\'accesso con Google')}
                  shape="pill"
                  text="signup_with"
                />
                <Button 
                  variant="outline-primary" 
                  className="rounded-pill"
                  onClick={handleFacebookLogin}
                >
                  <i className="bi bi-facebook me-2"></i>
                  Continua con Facebook
                </Button>
              </div>
            </div>

            <div className="d-grid">
              <Button
                type="submit"
                className="rounded-pill"
                disabled={loading}
                style={{
                  backgroundColor: 'var(--primary-color)',
                  border: 'none'
                }}
              >
                {loading ? 'Registrazione in corso...' : 'Registrati'}
              </Button>
            </div>

            <div className="text-center mt-3">
              <span className="text-muted">Hai già un account? </span>
              <Button
                variant="link"
                onClick={() => navigate('/auth')}
                style={{ color: 'var(--primary-color)' }}
              >
                Accedi
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserRegister;