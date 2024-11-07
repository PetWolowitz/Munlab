import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaInfoCircle } from 'react-icons/fa';
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
  
  const navigate = useNavigate();

  // Tooltips per i campi
  const fieldTooltips = {
    firstName: "Inserisci il tuo nome",
    lastName: "Inserisci il tuo cognome",
    username: "Inserisci un username unico di almeno 4 caratteri",
    email: "Inserisci un indirizzo email valido",
    password: "La password deve contenere almeno 8 caratteri, una maiuscola, una minuscola e un numero",
    confirmPassword: "Ripeti la password per conferma",
    role: "Seleziona il tuo ruolo all'interno dell'organizzazione",
    department: "Seleziona il dipartimento di appartenenza"
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

  // Gestione dell'input
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

  // Validazione del form
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

  // Gestione del submit
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

  // Componente per il tooltip
  const renderTooltip = (content) => (props) => (
    <Tooltip {...props}>
      {content}
    </Tooltip>
  );

  // Componente per i campi del form con tooltip
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

  // Componente per l'indicatore di forza della password
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
            <h3 className="text-center mb-4">Registrazione Amministratore</h3>
            
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

            <Form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Step 1: Informazioni Personali */}
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
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Step 2: Informazioni Account */}
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
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Step 3: Password e Ruolo */}
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
                  </motion.div>
                )}
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
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
};

export default AdminRegister;
