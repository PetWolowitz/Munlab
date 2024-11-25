import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedUserType }) => {
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true); // Stato per gestire il caricamento
  const token = localStorage.getItem('access_token');
  const userType = localStorage.getItem('user_type');

  useEffect(() => {
    const validateToken = async () => {
      try {
        if (!token) {
          setIsValidating(false);
          return;
        }

        const response = await fetch('/api/users/validate-token/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Token non valido');
        }

        setIsValidating(false); // Validazione completata
      } catch (error) {
        console.error('Errore di validazione token:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_type');
        navigate('/auth');
      }
    };

    validateToken();
  }, [token, navigate]);

  // Mostra un caricamento durante la validazione
  if (isValidating) {
    return <div>Caricamento...</div>; // Puoi sostituirlo con un loader più elaborato
  }

  // Controllo autenticazione
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  // Controllo del tipo di utente
  if (allowedUserType && userType !== allowedUserType) {
    return <Navigate to="/dashboard" replace />;
  }

  // Utente autenticato e autorizzato
  return children;
};

export default PrivateRoute;
