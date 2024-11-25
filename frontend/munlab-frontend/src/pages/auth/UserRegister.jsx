import React, { useState, useRef, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaInfoCircle, FaGoogle, FaFacebook, FaEye, FaEyeSlash } from 'react-icons/fa';
import { validateField, validatePassword } from '../../utils/validationUtils';
import authService from '../../services/authService';
import ProgressSteps from '../../components/ProgressSteps';
import AnimatedAlert from '../../components/AnimatedAlert';
import Loader from '../../components/Loader'; // Import del Loader
import '../../styles/layout.css';

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
  const [loading, setLoading] = useState(false); // Stato per il loader
  const [successMessage, setSuccessMessage] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validationTimeout = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (validationTimeout.current) {
        clearTimeout(validationTimeout.current);
      }
    };
  }, []);

  const fieldTooltips = {
    firstName: "Inserisci il tuo nome",
    lastName: "Inserisci il tuo cognome",
    username: "Inserisci un username unico di almeno 4 caratteri",
    email: "Inserisci un indirizzo email valido",
    password: "La password deve contenere almeno 8 caratteri, una maiuscola, una minuscola e un numero",
    confirmPassword: "Ripeti la password per conferma"
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

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

  const handleSocialLogin = async (provider) => {
    try {
      setLoading(true);
      if (provider === 'google') {
        await authService.handleGoogleLogin();
      } else {
        await authService.handleFacebookLogin();
      }
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setGeneralError(`Errore durante l'accesso con ${provider}`);
    } finally {
      setLoading(false);
    }
  };

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

  const PasswordStrengthIndicator = ({ password }) => {
    const strength = getPasswordStrength(password);
    const getColor = () => {
      switch (strength) {
        case 0: return 'var(--error-color)';
        case 1:
        case 2: return '#ffc107';
        case 3:
        case 4:
        case 5: return '#28a745';
        default: return '#28a745';
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

    if (Object.keys(newErrors).length > 0) {
      setGeneralError('Per favore, correggi gli errori nel form prima di procedere.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register({
        ...formData,
        user_type: 'user'
      });

      setSuccessMessage('Registrazione completata con successo!');

      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1500);
    } catch (error) {
      setGeneralError('Errore durante la registrazione. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="auth-container">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Card className="auth-card">
          <Card.Body className="p-4">
            <h3 className="text-center mb-4">Registrazione Utente</h3>

            <ProgressSteps currentStep={currentStep} totalSteps={3} />

            {/* Loader durante il caricamento */}
            {loading && <Loader />}

            {/* Errori e messaggi di successo */}
            {generalError && (
              <AnimatedAlert
                show={true}
                variant="danger"
                onClose={() => setGeneralError('')}
              >
                {generalError}
              </AnimatedAlert>
            )}

            {successMessage && (
              <AnimatedAlert
                show={true}
                variant="success"
                onClose={() => setSuccessMessage('')}
              >
                {successMessage}
              </AnimatedAlert>
            )}

            <Form onSubmit={handleSubmit} noValidate>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
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
                    <Row className="mb-3">
                      <Col md={6}>
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
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="d-flex justify-content-between mt-4">
                {currentStep > 1 && (
                  <Button
                    variant="outline-primary"
                    onClick={() => setCurrentStep((curr) => curr - 1)}
                    className="rounded-pill"
                    disabled={loading}
                  >
                    Indietro
                  </Button>
                )}

                {currentStep < 3 ? (
                  <Button
                    variant="primary"
                    onClick={() => setCurrentStep((curr) => curr + 1)}
                    className="rounded-pill ms-auto"
                    disabled={loading}
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
                      border: 'none'
                    }}
                  >
                    {loading ? <Loader /> : 'Completa Registrazione'}
                  </Button>
                )}
              </div>
            </Form>

            <div className="text-center mt-3">
              <Button
                variant="link"
                onClick={() => navigate('/auth')}
                className="text-muted text-decoration-none"
              >
                Torna al login
              </Button>
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
};

export default UserRegister;
