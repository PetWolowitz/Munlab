import React, { useState } from 'react';
import { Container, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaEyeSlash, FaUser, FaLock, FaGoogle, FaFacebook } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import AnimatedAlert from '../../components/AnimatedAlert';
import '../../styles/auth.css';

const AccountTypeSelection = () => {
  const [accountType, setAccountType] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(formData.username, formData.password, accountType);
      if (accountType === 'admin') {
        if (response.user?.is_approved) {
          navigate('/dashboard');
        } else {
          navigate('/admin/pending-approval');
        }
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Errore durante il login. Verifica le tue credenziali.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    try {
      const response = await (provider === 'google' ? login('google') : login('facebook'));
      navigate('/dashboard');
    } catch (err) {
      setError(`Errore durante l'accesso con ${provider}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="auth-container shadow">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2 }}
      >
        <Card className="auth-card shadow-lg bg-white rounded-lg">
          <Card.Body className="p-4">
            <motion.h3 
              className="text-center mb-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              Accedi a MunLab
            </motion.h3>

            <div className="d-flex justify-content-center gap-4 mb-5">
              {/* Card Amministratore */}
              <motion.div 
                className={`account-type-card p-4 text-center shadow hover:shadow-md transition-shadow duration-300 ${
                  accountType === 'admin' ? 'selected shadow-lg ring-2 ring-blue-500' : ''
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAccountType('admin')}
                style={{
                  flex: 1,
                  maxWidth: '200px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  minHeight: '180px'
                }}
              >
                <div className="icon-container mb-auto mt-3 p-3 bg-gray-50 rounded-full">
                  <img src="/admin-icon.svg" alt="Admin" width="64" height="64" />
                </div>
                <div className="mt-auto mb-3">Operatore</div>
                {accountType === 'admin' && (
                  <motion.div 
                    className="check-icon"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    ✓
                  </motion.div>
                )}
              </motion.div>

              {/* Card Utente */}
              <motion.div 
                className={`account-type-card p-4 text-center shadow hover:shadow-md transition-shadow duration-300 ${
                  accountType === 'user' ? 'selected shadow-lg ring-2 ring-blue-500' : ''
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAccountType('user')}
                style={{
                  flex: 1,
                  maxWidth: '200px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  minHeight: '180px'
                }}
              >
                <div className="icon-container mb-auto mt-3 p-3 bg-gray-50 rounded-full">
                  <img src="/user-icon.svg" alt="User" width="64" height="64" />
                </div>
                <div className="mt-auto mb-3">Visitatori</div>
                {accountType === 'user' && (
                  <motion.div 
                    className="check-icon"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    ✓
                  </motion.div>
                )}
              </motion.div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <AnimatedAlert 
                    variant="danger" 
                    onClose={() => setError('')}
                  >
                    {error}
                  </AnimatedAlert>
                </motion.div>
              )}
            </AnimatePresence>

            {accountType && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <div className="position-relative">
                      <FaUser className="position-absolute top-50 translate-middle-y ms-3 text-muted" />
                      <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          username: e.target.value
                        }))}
                        placeholder="Username"
                        required
                        className="ps-5 rounded-pill"
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <div className="position-relative">
                      <FaLock className="position-absolute top-50 translate-middle-y ms-3 text-muted" />
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          password: e.target.value
                        }))}
                        placeholder="Password"
                        required
                        className="ps-5 rounded-pill"
                      />
                      <Button
                        variant="link"
                        className="position-absolute top-50 translate-middle-y end-0 me-2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </div>
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check
                      type="checkbox"
                      id="rememberMe"
                      label="Ricordami"
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        rememberMe: e.target.checked
                      }))}
                    />
                    <Button 
                      variant="link" 
                      className="p-0 text-decoration-none"
                      onClick={() => navigate('/auth/reset-password')}
                    >
                      Password dimenticata?
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-100 mb-3 rounded-pill"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          className="me-2"
                        />
                        Accesso in corso...
                      </>
                    ) : (
                      'Accedi'
                    )}
                  </Button>

                  <div className="position-relative mb-4">
                    <hr />
                    <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted">
                      oppure
                    </span>
                  </div>

                  <div className="d-grid gap-2 mb-4">
                    <Button
                      variant="outline-danger"
                      className="rounded-pill"
                      onClick={() => handleSocialLogin('google')}
                      disabled={loading}
                    >
                      <FaGoogle className="me-2" />
                      Continua con Google
                    </Button>
                    <Button
                      variant="outline-primary"
                      className="rounded-pill"
                      onClick={() => handleSocialLogin('facebook')}
                      disabled={loading}
                    >
                      <FaFacebook className="me-2" />
                      Continua con Facebook
                    </Button>
                  </div>

                  <div className="text-center">
                    <Button
                      variant="link"
                      onClick={() => navigate(
                        accountType === 'admin' 
                          ? '/auth/admin-register' 
                          : '/auth/user-register'
                      )}
                      className="text-decoration-none"
                    >
                      Non hai un account? Registrati
                    </Button>
                  </div>
                </Form>
              </motion.div>
            )}
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
};

export default AccountTypeSelection;