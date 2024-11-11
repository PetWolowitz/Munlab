import axios from 'axios';
import { sanitizeInput } from '../utils/securityUtils';

const API_URL = 'http://127.0.0.1:8000/api/users/';

// Configurazione di Axios
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

// Interceptor per aggiungere l'header di autenticazione
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const authService = {
  register: async (userData) => {
    if (!userData) {
      throw new Error('Dati utente richiesti');
    }

    const sanitizedData = {
      username: sanitizeInput(userData.username),
      email: sanitizeInput(userData.email),
      password: userData.password,
      password2: userData.password,
      first_name: sanitizeInput(userData.firstName),
      last_name: sanitizeInput(userData.lastName),
      user_type: userData.user_type || 'user'
    };

    if (userData.user_type === 'admin') {
      sanitizedData.role = sanitizeInput(userData.role);
      sanitizedData.department = sanitizeInput(userData.department);
    }

    try {
      console.log('Sending registration data:', sanitizedData);
      const response = await axios.post(`${API_URL}register/`, sanitizedData);
      console.log('Registration response:', response.data);

      if (response.data.tokens) {
        // Salva token e dati utente
        localStorage.setItem('access_token', response.data.tokens.access);
        localStorage.setItem('refresh_token', response.data.tokens.refresh);
        localStorage.setItem('user_type', userData.user_type);
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
        
        // Imposta header per future richieste
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.tokens.access}`;

        // Se l'utente è admin, verifica se richiede approvazione
        if (userData.user_type === 'admin' && response.data.requires_approval) {
          return {
            ...response.data,
            shouldRedirect: '/admin/pending-approval'
          };
        } else {
          // Per utenti normali o admin già approvati
          return {
            ...response.data,
            shouldRedirect: '/dashboard'
          };
        }
      }

      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error);
      throw error;
    }
  },

  // Aggiungi questa nuova funzione per gestire i reindirizzamenti
  handleAuthRedirect: (userData) => {
    const userType = userData?.user_type || localStorage.getItem('user_type');
    const isApproved = userData?.is_approved;

    if (userType === 'admin' && !isApproved) {
      return '/admin/pending-approval';
    }
    return '/dashboard';
  },

  // Aggiungi questa funzione per verificare se l'utente può accedere alla dashboard
  canAccessDashboard: async () => {
    const userType = localStorage.getItem('user_type');
    
    if (userType === 'admin') {
      try {
        const status = await authService.checkApprovalStatus();
        return status.is_approved;
      } catch (error) {
        console.error('Error checking dashboard access:', error);
        return false;
      }
    }
    
    // Gli utenti normali possono sempre accedere alla loro dashboard
    return userType === 'user';
  },

  // Remember Me
  login: async (username, password, rememberMe = false) => {
    try {
      const response = await axios.post(`${API_URL}login/`, {
        username: sanitizeInput(username),
        password,
        remember_me: rememberMe
      });
      
      if (response.data.tokens) {
        // Se "remember me" è attivo, salva in localStorage, altrimenti in sessionStorage
        const storage = rememberMe ? localStorage : sessionStorage;
        
        storage.setItem('access_token', response.data.tokens.access);
        storage.setItem('refresh_token', response.data.tokens.refresh);
        storage.setItem('user_type', response.data.user.user_type);
        storage.setItem('user_data', JSON.stringify(response.data.user));
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.tokens.access}`;
      }
      
      return response.data;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  },

  // Reset Password
  requestPasswordReset: async (email) => {
    try {
      const response = await axios.post(`${API_URL}request-password-reset/`, {
        email: sanitizeInput(email)
      });
      return response.data;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await axios.post(`${API_URL}reset-password/`, {
        token,
        password: newPassword
      });
      return response.data;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  },

  // Token Refresh
  refreshToken: async () => {
    try {
      const refresh = localStorage.getItem('refresh_token') || 
                      sessionStorage.getItem('refresh_token');
      
      if (!refresh) throw new Error('No refresh token available');

      const response = await axios.post(`${API_URL}token/refresh/`, {
        refresh
      });

      if (response.data.access) {
        const storage = localStorage.getItem('refresh_token') ? 
                        localStorage : sessionStorage;
        
        storage.setItem('access_token', response.data.access);
        axios.defaults.headers.common['Authorization'] = 
          `Bearer ${response.data.access}`;
      }

      return response.data;
    } catch (error) {
      authService
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_type');
    localStorage.removeItem('user_data');
    delete axios.defaults.headers.common['Authorization'];
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },

  getUserType: () => {
    return localStorage.getItem('user_type');
  },

  getUserData: () => {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },

  checkApprovalStatus: async () => {
    try {
      const response = await axios.get(`${API_URL}check-approval/`);
      return response.data;
    } catch (error) {
      console.error('Approval check error:', error);
      return { is_approved: false };
    }
  },

  getPendingAdmins: async () => {
    try {
      const response = await axios.get(`${API_URL}pending-admins/`);
      return response.data.pending_admins;
    } catch (error) {
      console.error('Get pending admins error:', error);
      throw error;
    }
  },

  approveAdmin: async (userId) => {
    try {
      const response = await axios.post(`${API_URL}approve-admin/${userId}/`);
      return response.data;
    } catch (error) {
      console.error('Approve admin error:', error);
      throw error;
    }
  },

  verifyToken: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return false;

    try {
      await axios.post(`${API_URL}token/verify/`, { token });
      return true;
    } catch {
      authService.logout();
      return false;
    }
  },

  getCurrentUser: () => {
    const token = localStorage.getItem('access_token');
    const userType = localStorage.getItem('user_type');
    const userData = localStorage.getItem('user_data');
    return token ? { 
      token, 
      userType,
      ...JSON.parse(userData || '{}')
    } : null;
  },

  // Gestione social login
  handleGoogleLogin: async (credential) => {
    try {
      const response = await axios.post(`${API_URL}social-auth/`, {
        token: credential,
        provider: 'google'
      });
      
      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('user_type', 'user');
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      }
      
      return response.data;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  },

  handleFacebookLogin: async (response) => {
    try {
      const authResponse = await axios.post(`${API_URL}social-auth/`, {
        token: response.accessToken,
        provider: 'facebook'
      });
      
      if (authResponse.data.access) {
        localStorage.setItem('access_token', authResponse.data.access);
        localStorage.setItem('user_type', 'user');
        localStorage.setItem('user_data', JSON.stringify(authResponse.data.user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${authResponse.data.access}`;
      }
      
      return authResponse.data;
    } catch (error) {
      console.error('Facebook login error:', error);
      throw error;
    }
  }
};

export default authService;