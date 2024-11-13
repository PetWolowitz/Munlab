import React, { useEffect, useState } from 'react';
import { Container, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import authService from '../../services/authService';
import "../../styles/auth.css";
  

const AdminPendingApproval = () => {
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkApprovalStatus = async () => {
      try {
        const status = await authService.checkAdminStatus();
        if (status.isApproved) {
          navigate('/templates/emails/admin_approval_request/');
        }
      } catch (error) {
        console.error('Error checking approval status:', error);
      } finally {
        setIsChecking(false);
      }
    };

    const intervalId = setInterval(checkApprovalStatus, 30000);
    checkApprovalStatus();

    return () => clearInterval(intervalId);
  }, [navigate]);

  return (
    <Container fluid className="auth-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="auth-card">
          <Card.Body className="text-center p-5">
            <div className="mb-4">
              <Spinner animation="border" variant="primary" />
            </div>
            
            <h3 className="mb-4">In Attesa di Approvazione</h3>
            
            <p className="text-muted mb-4">
              La tua richiesta di registrazione come amministratore è stata ricevuta 
              ed è in attesa di approvazione.
            </p>
            
            <p className="text-muted">
              Riceverai una email di conferma quando il tuo account sarà stato approvato.
              Puoi chiudere questa pagina e attendere la notifica via email.
            </p>
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
};

export default AdminPendingApproval;