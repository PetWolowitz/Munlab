import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AccountTypeSelection = () => {
  const [accountType, setAccountType] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.username, formData.password, accountType);
      navigate(accountType === 'admin' ? '/admin/dashboard' : '/calendar');
    } catch (err) {
      setError(err.response?.data?.message || 'Errore durante il login');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    navigate(accountType === 'admin' ? '/auth/admin-register' : '/auth/user-register');
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <Card.Body className="p-4">
          <h3 className="text-center mb-4">Scegli il tipo di Account</h3>

          <div className="d-flex justify-content-center gap-4 mb-5">
            {/* Card Amministratore */}
            <div 
              className={`account-type-card p-3 text-center ${accountType === 'admin' ? 'selected' : ''}`}
              onClick={() => setAccountType('admin')}
            >
              <div className="icon-container mb-2">
                <img src="/admin-icon.svg" alt="Admin" width="64" height="64" />
              </div>
              <div>Amministratore</div>
              {accountType === 'admin' && (
                <div className="check-icon">✓</div>
              )}
            </div>

            {/* Card Utente */}
            <div 
              className={`account-type-card p-3 text-center ${accountType === 'user' ? 'selected' : ''}`}
              onClick={() => setAccountType('user')}
            >
              <div className="icon-container mb-2">
                <img src="/user-icon.svg" alt="User" width="64" height="64" />
              </div>
              <div>Utente</div>
              {accountType === 'user' && (
                <div className="check-icon">✓</div>
              )}
            </div>
          </div>

          {accountType && (
            <>
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Username"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Accesso in corso...' : 'Accedi'}
                </Button>

                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={handleRegisterClick}
                    className="text-decoration-none"
                  >
                    Non hai un account? Registrati
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default AccountTypeSelection;