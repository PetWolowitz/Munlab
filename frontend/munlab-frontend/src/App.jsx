import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import PublicHome from './pages/public/PublicHome';
import AccountTypeSelection from './pages/auth/AccountTypeSelection';
import UserRegister from './pages/auth/UserRegister';
import AdminRegister from './pages/auth/AdminRegister';
import Dashboard from './pages/Dashboard';
import Activities from './pages/Activities';
import Bookings from './pages/Bookings';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/variables.css';
import './styles/layout.css';

const GOOGLE_CLIENT_ID = "IL-TUO-GOOGLE-CLIENT-ID";
const FACEBOOK_APP_ID = "IL-TUO-FACEBOOK-APP-ID";

// Componente per proteggere le rotte private
const PrivateRoute = ({ children, allowedUserType }) => {
  const token = localStorage.getItem('access_token');
  const userType = localStorage.getItem('user_type');

  if (!token) {
    return <Navigate to="/auth" />;
  }

  if (allowedUserType && userType !== allowedUserType) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  useEffect(() => {
    // Inizializzazione Facebook SDK
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
    };
  }, []);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Rotte pubbliche */}
            <Route path="/" element={<PublicHome />} />
            <Route path="/auth" element={<AccountTypeSelection />} />
            <Route path="/auth/user-register" element={<UserRegister />} />
            <Route path="/auth/admin-register" element={<AdminRegister />} />
            
            {/* Rotte protette */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute allowedUserType="admin">
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/activities"
              element={
                <PrivateRoute allowedUserType="admin">
                  <Activities />
                </PrivateRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <PrivateRoute>
                  <Bookings />
                </PrivateRoute>
              }
            />

            {/* Rotta per gestire URL non validi */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;