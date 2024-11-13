import React, { useState, useRef, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { validateField, validatePassword } from '../../utils/validationUtils';
import authService from '../../services/authService';
import ProgressSteps from '../../components/ProgressSteps';
import AnimatedAlert from '../../components/AnimatedAlert';
import '../../styles/layout.css';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: '',
    department: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationStatus, setRegistrationStatus] = useState('initial'); // 'initial', 'pending', 'approved'

  // Stati per mostrare/nascondere le password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validationTimeout = useRef(null);
  const navigate = useNavigate();

  // Pulizia timeout al dismount
  useEffect(() => {
    return () => {
      if (validationTimeout.current) {
        clearTimeout(validationTimeout.current);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Aggiorna immediatamente il valore del campo
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Ritarda la validazione per migliorare le performance
    if (validationTimeout.current) {
      clearTimeout(validationTimeout.current);
    }

    validationTimeout.current = setTimeout(() => {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error
      }));
    }, 500);
  };

  // Funzione per calcolare la forza della password
  const getPasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  // Componente per l'indicatore di forza della password
  const PasswordStrengthIndicator = ({ password }) => {
    const strength = getPasswordStrength(password);
    const getColor = () => {
      switch (strength) {
        case 0:
          return 'var(--error-color)';
        case 1:
        case 2:
          return '#ffc107';
        case 3:
        case 4:
        case 5:
          return '#28a745';
        default:
          return '#28a745';
      }
    };

    return (
      <div className="password-strength mt-2">
        <small className="text-muted">Forza password:</small>
        <div className="d-flex gap-1 mt-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <motion.div
              key={level}
              className="strength-bar"
              style={{
                height: '4px',
                width: '20%',
                backgroundColor: '#e9ecef',
                borderRadius: '2px'
              }}
              animate={{
                backgroundColor: level <= strength ? getColor() : '#e9ecef'
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
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

      // Salva token e user type
      if (response.data?.token) {
        localStorage.setItem('access_token', response.data.token);
        localStorage.setItem('user_type', 'admin');
      }

      if (response.data?.requires_approval) {
        setRegistrationStatus('pending');
        setSuccessMessage(
          'Registrazione effettuata con successo! La tua richiesta è in attesa di approvazione. ' +
          'Riceverai una email quando il tuo account sarà stato approvato.'
        );
      } else {
        setRegistrationStatus('approved');
        setSuccessMessage('Registrazione completata con successo!');
        // Reindirizza solo se non richiede approvazione
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setGeneralError(
          err.response?.data?.message || 'Errore durante la registrazione. Riprova più tardi.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Componente per lo stato di attesa approvazione
  const PendingApprovalScreen = () => (
    <Container fluid className="auth-container">
      <Card className="auth-card">
        <Card.Body className="p-4 text-center">
          <h3 className="mb-4">Registrazione in Attesa di Approvazione</h3>
          
          <div className="mb-4">
            <div className="pending-animation mb-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
            
            <p className="text-muted">
              La tua richiesta di registrazione come amministratore è stata ricevuta 
              ed è in attesa di approvazione da parte del super admin.
            </p>
            
            <p className="text-muted">
              Riceverai una email di conferma quando il tuo account sarà stato approvato.
            </p>
          </div>

          <Button 
            variant="outline-primary" 
            onClick={() => navigate('/auth')}
            className="rounded-pill"
          >
            Torna alla Home
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );

  // Mostra la schermata di attesa se necessario
  if (registrationStatus === 'pending') {
    return <PendingApprovalScreen />;
  }
  // Animazioni
  const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 }
  };

  return (
    <Container fluid className="auth-container">
      <Card className="auth-card">
        <Card.Body className="p-4">
          <h3 className="text-center mb-4">Registrazione Amministratore</h3>

          <ProgressSteps currentStep={currentStep} totalSteps={3} />

          {generalError && (
            <AnimatedAlert show={true} variant="danger" onClose={() => setGeneralError('')}>
              {generalError}
            </AnimatedAlert>
          )}

          {successMessage && (
            <AnimatedAlert show={true} variant="success" onClose={() => setSuccessMessage('')}>
              {successMessage}
            </AnimatedAlert>
          )}

          <Form onSubmit={handleSubmit} noValidate>
            <AnimatePresence mode="wait">
              <motion.div key={currentStep} {...pageTransition}>
                {currentStep === 1 && (
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
                )}

                {currentStep === 2 && (
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
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
                    </Col>
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
                  </Row>
                )}

                {currentStep === 3 && (
                  <>
                    <Row className="mb-3">
                      <Col md={6}>
                        {/* Campo Password con mostra/nascondi */}
                        <Form.Group>
                          <Form.Label>Password</Form.Label>
                          <div className="position-relative">
                            <Form.Control
                              type={showPassword ? 'text' : 'password'}
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              isInvalid={!!errors.password}
                              required
                              className="rounded-pill"
                            />
                            <Button
                              variant="link"
                              className="position-absolute top-50 end-0 translate-middle-y"
                              onClick={() => setShowPassword(!showPassword)}
                              style={{ zIndex: 10 }}
                            >
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </Button>
                            <Form.Control.Feedback type="invalid">
                              {errors.password}
                            </Form.Control.Feedback>
                          </div>
                          <PasswordStrengthIndicator password={formData.password} />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        {/* Campo Conferma Password con mostra/nascondi */}
                        <Form.Group>
                          <Form.Label>Conferma Password</Form.Label>
                          <div className="position-relative">
                            <Form.Control
                              type={showConfirmPassword ? 'text' : 'password'}
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              isInvalid={!!errors.confirmPassword}
                              required
                              className="rounded-pill"
                            />
                            <Button
                              variant="link"
                              className="position-absolute top-50 end-0 translate-middle-y"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              style={{ zIndex: 10 }}
                            >
                              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </Button>
                            <Form.Control.Feedback type="invalid">
                              {errors.confirmPassword}
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mb-3">
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
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Dipartimento</Form.Label>
                          <Form.Select
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            isInvalid={!!errors.department}
                            required
                            className="rounded-pill"
                          >
                            <option value="">Seleziona dipartimento</option>
                            <option value="education">Educazione</option>
                            <option value="operations">Operazioni</option>
                            <option value="management">Management</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.department}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Pulsanti di navigazione */}
            <div className="d-flex justify-content-between mt-4">
              {currentStep > 1 && (
                <Button
                  variant="outline-primary"
                  onClick={() => setCurrentStep((curr) => curr - 1)}
                  className="rounded-pill"
                >
                  Indietro
                </Button>
              )}

              {currentStep < 3 ? (
                <Button
                  variant="primary"
                  onClick={() => setCurrentStep((curr) => curr + 1)}
                  className="rounded-pill ms-auto"
                >
                  Avanti
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="rounded-pill ms-auto"
                  disabled={loading}
                  style={{
                    backgroundColor: 'var(--primary-color)',
                    border: 'none',
                    
                  }}
                >
                  {loading ? 'Registrazione in corso...' : 'Completa Registrazione'}
                </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminRegister;
