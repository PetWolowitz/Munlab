
import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaInfoCircle, FaGoogle, FaFacebook } from 'react-icons/fa';
import { validateField, validatePassword } from '../../utils/validationUtils';
import authService from '../../services/authService';
import ProgressSteps from '../../components/ProgressSteps';
import AnimatedAlert from '../../components/AnimatedAlert';
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
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  
  const navigate = useNavigate();

  // Tooltips per i campi
  const fieldTooltips = {
    firstName: "Inserisci il tuo nome",
    lastName: "Inserisci il tuo cognome",
    username: "Inserisci un username unico di almeno 4 caratteri",
    email: "Inserisci un indirizzo email valido",
    password: "La password deve contenere almeno 8 caratteri, una maiuscola, una minuscola e un numero",
    confirmPassword: "Ripeti la password per conferma"
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

  // Gestione login social
  const handleGoogleLogin = async () => {
    try {
      // Implementare quando avremo le API key
      const response = await authService.handleGoogleLogin();
      navigate('/calendar'); // Reindirizza alla pagina delle attività
    } catch (error) {
      setGeneralError('Errore durante l\'accesso con Google');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      // Implementare quando avremo le API key
      const response = await authService.handleFacebookLogin();
      navigate('/calendar'); // Reindirizza alla pagina delle attività
    } catch (error) {
      setGeneralError('Errore durante l\'accesso con Facebook');
    }
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
        user_type: 'user'
      });

      setSuccessMessage('Registrazione completata con successo!');

      // Reindirizza alla pagina delle attività dopo 2 secondi
      setTimeout(() => {
        navigate('/calendar');
      }, 2000);

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

  // Componenti UI riutilizzabili
  const renderTooltip = (content) => (props) => (
    <Tooltip {...props}>
      {content}
    </Tooltip>
  );

  const FieldWithTooltip = ({ label, name, type, value, onChange, error, tooltip }) => (
    <Form.Group>
      <Form.Label className="d-flex align-items-center">
        {label}
        <OverlayTrigger
          placement="right"
          overlay={renderTooltip(tooltip)}
        >
          <span className="ms-2">
            <FaInfoCircle className="text-muted" />
          </span>
        </OverlayTrigger>
      </Form.Label>
      <Form.Control
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        isInvalid={!!error}
        required
        className="rounded-pill"
      />
      <Form.Control.Feedback type="invalid">
        {error}
      </Form.Control.Feedback>
    </Form.Group>
  );

  const PasswordStrengthIndicator = ({ password }) => {
    const strength = getPasswordStrength(password);
    const getColor = () => {
      switch (strength) {
        case 0: return 'var(--error-color)';
        case 1: case 2: return '#ffc107';
        case 3: case 4: return '#28a745';
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

  // Animazioni
  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  };

  return (
    <Container fluid className="auth-container">
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
      >
        <Card className="auth-card">
          <Card.Body className="p-4">
            <h3 className="text-center mb-4">Registrazione Utente</h3>
            
            <ProgressSteps currentStep={currentStep} totalSteps={3} />

            <AnimatedAlert 
              show={!!generalError} 
              variant="danger" 
              onClose={() => setGeneralError('')}
            >
              {generalError}
            </AnimatedAlert>

            <AnimatedAlert 
              show={!!successMessage} 
              variant="success" 
              onClose={() => setSuccessMessage('')}
            >
              {successMessage}
            </AnimatedAlert>

            {/* Social Login Buttons */}
            <div className="text-center mb-4">
              <p className="text-muted">Registrati con</p>
              <div className="d-flex justify-content-center gap-3">
                <Button 
                  variant="outline-danger" 
                  className="rounded-pill" 
                  onClick={handleGoogleLogin}
                >
                  <FaGoogle className="me-2" />
                  Google
                </Button>
                <Button 
                  variant="outline-primary" 
                  className="rounded-pill"
                  onClick={handleFacebookLogin}
                >
                  <FaFacebook className="me-2" />
                  Facebook
                </Button>
              </div>
              <div className="position-relative my-4">
                <hr />
                <span className="position-absolute top-50 start-50 translate-middle px-3 bg-white text-muted">
                  oppure
                </span>
              </div>
            </div>

            <Form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Step 1: Informazioni Personali */}
                  {currentStep === 1 && (
                    <Row className="mb-3">
                      <Col md={6}>
                        <FieldWithTooltip
                          label="Nome"
                          name="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          error={errors.firstName}
                          tooltip={fieldTooltips.firstName}
                        />
                      </Col>
                      <Col md={6}>
                        <FieldWithTooltip
                          label="Cognome"
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          error={errors.lastName}
                          tooltip={fieldTooltips.lastName}
                        />
                      </Col>
                    </Row>
                  )}

                  {/* Step 2: Email e Username */}
                  {currentStep === 2 && (
                    <Row className="mb-3">
                      <Col md={6}>
                        <FieldWithTooltip
                          label="Email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          error={errors.email}
                          tooltip={fieldTooltips.email}
                        />
                      </Col>
                      <Col md={6}>
                        <FieldWithTooltip
                          label="Username"
                          name="username"
                          type="text"
                          value={formData.username}
                          onChange={handleInputChange}
                          error={errors.username}
                          tooltip={fieldTooltips.username}
                        />
                      </Col>
                    </Row>
                  )}

                  {/* Step 3: Password */}
                  {currentStep === 3 && (
                    <Row className="mb-3">
                      <Col md={6}>
                        <FieldWithTooltip
                          label="Password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          error={errors.password}
                          tooltip={fieldTooltips.password}
                        />
                        <PasswordStrengthIndicator password={formData.password} />
                      </Col>
                      <Col md={6}>
                        <FieldWithTooltip
                          label="Conferma Password"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          error={errors.confirmPassword}
                          tooltip={fieldTooltips.confirmPassword}
                        />
                      </Col>
                    </Row>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Pulsanti di navigazione */}
              <div className="d-flex justify-content-between mt-4">
                {currentStep > 1 && (
                  <Button
                    variant="outline-primary"
                    onClick={() => setCurrentStep(curr => curr - 1)}
                    className="rounded-pill"
                  >
                    Indietro
                  </Button>
                )}
                
                {currentStep < 3 ? (
                  <Button
                    variant="primary"
                    onClick={() => setCurrentStep(curr => curr + 1)}
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
                      border: 'none'
                    }}
                  >
                    {loading ? 'Registrazione in corso...' : 'Completa Registrazione'}
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