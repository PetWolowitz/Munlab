import React, { useEffect, useState } from 'react';
import { Container, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';

export default function PendingApproval() {
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const checkApproval = async () => {
      // Se non c'è autenticazione, reindirizza al login
      if (!authService.isAuthenticated()) {
        console.log("Utente non autenticato, reindirizzamento al login.");
        navigate('/auth');
        return;
      }

      try {
        console.log("Verifica dello stato di approvazione in corso...");
        const status = await authService.checkApprovalStatus();
        console.log("Risultato dello stato di approvazione:", status);
        
        // Se l'admin è stato approvato, vai alla dashboard
        if (status.is_approved) {
          navigate('/dashboard');
        } else {
          setIsChecking(false); // L'utente è in attesa di approvazione
        }
      } catch (error) {
        console.error('Errore durante il controllo dello stato di approvazione:', error);
        navigate('/auth'); // Reindirizza al login in caso di errore
      }
    };

    checkApproval();
    const interval = setInterval(checkApproval, 30000);

    return () => clearInterval(interval);
  }, [navigate]);

  if (!user || isChecking) {
    return (
      <Container fluid className="auth-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <Card className="auth-card text-center">
            <Card.Body className="p-5">
              <Spinner animation="border" variant="primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <h3 className="mt-4">Verifica dello stato di approvazione...</h3>
            </Card.Body>
          </Card>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container fluid className="auth-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
      >
        <Card className="auth-card text-center">
          <Card.Body className="p-5">
            <div className="mb-4">
              <Spinner animation="border" variant="primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
            <h3 className="mb-4">In Attesa di Approvazione</h3>
            <p className="text-muted mb-4">
              Ciao {user.firstName},<br />
              La tua richiesta di registrazione come amministratore è stata ricevuta 
              ed è in attesa di approvazione.
            </p>
            <p className="text-muted">
              Riceverai una email di conferma quando il tuo account sarà stato approvato.
              Puoi chiudere questa pagina e tornare più tardi.
            </p>
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
}
