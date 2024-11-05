import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
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
      navigate(accountType === 'admin' ? '/dashboard' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Errore durante il login');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    // Reindirizza alla pagina di registrazione appropriata in base al tipo di account
    if (accountType === 'admin') {
      navigate('/auth/admin-register');
    } else {
      navigate('/auth/user-register');
    }
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center" 
               style={{ background: 'var(--background-color)' }}>
      <Card className="border-0 shadow-sm" style={{ maxWidth: '400px', width: '100%' }}>
        <Card.Body className="p-4">
          <h3 className="text-center mb-4" style={{ color: 'var(--primary-color)' }}>
            Scegli il tipo di Account
          </h3>

          <div className="d-flex justify-content-center gap-4 mb-5">
            {/* Card Amministratore */}
            <div 
              className={`account-type-card p-3 text-center cursor-pointer ${accountType === 'admin' ? 'selected' : ''}`}
              onClick={() => setAccountType('admin')}
              style={{
                border: accountType === 'admin' ? '2px solid var(--primary-color)' : '1px solid #dee2e6',
                borderRadius: '12px',
                cursor: 'pointer',
                width: '140px'
              }}
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
              className={`account-type-card p-3 text-center cursor-pointer ${accountType === 'user' ? 'selected' : ''}`}
              onClick={() => setAccountType('user')}
              style={{
                border: accountType === 'user' ? '2px solid var(--primary-color)' : '1px solid #dee2e6',
                borderRadius: '12px',
                cursor: 'pointer',
                width: '140px'
              }}
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

              <Row className="g-3">
                <Col xs={12}>
                  <Button
                    onClick={() => handleRegisterClick()}
                    className="w-100 rounded-pill mb-3"
                    variant="outline-primary"
                    style={{
                      borderColor: 'var(--primary-color)',
                      color: 'var(--primary-color)'
                    }}
                  >
                    Registrati come {accountType === 'admin' ? 'Amministratore' : 'Utente'}
                  </Button>
                </Col>

                <Col xs={12}>
                  <div className="text-center mb-3">
                    <span className="text-muted">oppure</span>
                  </div>
                </Col>

                <Col xs={12}>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Username"
                        required
                        className="rounded-pill"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <div className="position-relative">
                        <Form.Control
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Password"
                          required
                          className="rounded-pill"
                        />
                      </div>
                    </Form.Group>

                    <Button
                      type="submit"
                      className="w-100 rounded-pill"
                      disabled={loading}
                      style={{
                        backgroundColor: 'var(--primary-color)',
                        border: 'none'
                      }}
                    >
                      {loading ? 'Accesso in corso...' : 'Accedi'}
                    </Button>
                  </Form>
                </Col>
              </Row>
            </>
          )}
        </Card.Body>
      </Card>

      <style jsx>{`
        .account-type-card {
          transition: all 0.3s ease;
        }
        
        .account-type-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .account-type-card.selected {
          background-color: rgba(139, 69, 19, 0.05);
        }

        .check-icon {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--primary-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }
      `}</style>
    </Container>
  );
};

export default AccountTypeSelection;