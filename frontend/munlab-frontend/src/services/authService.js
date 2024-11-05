// src/services/authService.js
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

    // Prepara i dati per il backend
    const sanitizedData = {
      username: sanitizeInput(userData.username),
      email: sanitizeInput(userData.email),
      password: userData.password,
      password2: userData.password,  // Aggiungiamo password2 come richiesto dal serializer
      first_name: sanitizeInput(userData.firstName),
      last_name: sanitizeInput(userData.lastName),
      user_type: userData.user_type || 'user'
    };

    // Se è un admin, aggiungi i campi specifici
    if (userData.user_type === 'admin') {
      sanitizedData.employeeId = sanitizeInput(userData.employeeId);
      sanitizedData.role = sanitizeInput(userData.role);
      sanitizedData.department = sanitizeInput(userData.department);
    }

    try {
      console.log('Sending registration data:', sanitizedData);
      const response = await axios.post(`${API_URL}register/`, sanitizedData);
      console.log('Registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error);
      throw error;
    }
  },

  login: async (username, password, userType) => {
    try {
      const response = await axios.post(`${API_URL}token/`, {
        username: sanitizeInput(username),
        password: password,
        user_type: userType
      });
      
      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('user_type', userType);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_type');
    delete axios.defaults.headers.common['Authorization'];
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
    return token ? { token, userType } : null;
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