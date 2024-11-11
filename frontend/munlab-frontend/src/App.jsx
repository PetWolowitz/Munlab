import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import PrivateRoute from './components/PrivateRoute';
import PublicHome from './pages/public/PublicHome';
import AccountTypeSelection from './pages/auth/AccountTypeSelection';
import UserRegister from './pages/auth/UserRegister';
import AdminRegister from './pages/auth/AdminRegister';
import DashboardContainer from './pages/dashboard/DashboardContainer';
import PendingApproval from './pages/auth/PendingApproval';
import Activities from './pages/Activities';
import Bookings from './pages/Bookings';
import UserProfile from './pages/user/UserProfile';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/variables.css';
import './styles/layout.css';

const GOOGLE_CLIENT_ID = "IL-TUO-GOOGLE-CLIENT-ID";
const FACEBOOK_APP_ID = "IL-TUO-FACEBOOK-APP-ID";

function App() {
  useEffect(() => {
    // Inizializzazione del Facebook SDK
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

            {/* Rotta per la pagina di attesa dell'approvazione dell'admin */}
            <Route path="/admin/pending-approval" element={<PendingApproval />} />
            
            {/* Dashboard e relative funzionalità */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute allowedUserType="approved">
                  <DashboardContainer />
                </PrivateRoute>
              }
            />

            {/* Rotte protette condivise */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <UserProfile />
                </PrivateRoute>
              }
            />
            
            {/* Rotte per funzionalità specifiche admin */}
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
                <PrivateRoute allowedUserType="admin">
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
