import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedUserType }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');
  const userType = localStorage.getItem('user_type');

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch('/api/users/validate-token/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user_type');
          navigate('/auth');
        }
      } catch (error) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_type');
        navigate('/auth');
      }
    };

    if (token) {
      validateToken();
    }
  }, [token, navigate]);

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedUserType && userType !== allowedUserType) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PrivateRoute;