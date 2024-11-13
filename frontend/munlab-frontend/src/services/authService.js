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
  // Funzione di registrazione migliorata
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
        localStorage.setItem('access_token', response.data.tokens.access);
        localStorage.setItem('refresh_token', response.data.tokens.refresh);
        localStorage.setItem('user_type', userData.user_type);
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.tokens.access}`;
        
        if (userData.user_type === 'admin') {
          if (response.data.requires_approval) {
            return {
              ...response.data,
              shouldRedirect: '/admin/pending-approval',
              message: 'Registrazione completata. In attesa di approvazione.'
            };
          }
          return {
            ...response.data,
            shouldRedirect: '/dashboard/admin',
            message: 'Registrazione admin completata con successo!'
          };
        }
        
        return {
          ...response.data,
          shouldRedirect: '/dashboard',
          message: 'Registrazione completata con successo!'
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error);
      throw error;
    }
  },
  
  // Login migliorato con gestione "remember me"
  login: async (username, password, rememberMe = false) => {
    try {
      const response = await axios.post(`${API_URL}login/`, {
        username: sanitizeInput(username),
        password,
        remember_me: rememberMe
      });
      
      if (response.data.tokens) {
        const storage = rememberMe ? localStorage : sessionStorage;
        
        storage.setItem('access_token', response.data.tokens.access);
        storage.setItem('refresh_token', response.data.tokens.refresh);
        storage.setItem('user_type', response.data.user.user_type);
        storage.setItem('user_data', JSON.stringify(response.data.user));
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.tokens.access}`;
        
        // Gestione reindirizzamento basato sul tipo utente
        if (response.data.user.user_type === 'admin') {
          if (!response.data.user.is_approved) {
            return {
              ...response.data,
              shouldRedirect: '/admin/pending-approval'
            };
          }
          return {
            ...response.data,
            shouldRedirect: '/dashboard/admin'
          };
        }
        
        return {
          ...response.data,
          shouldRedirect: '/dashboard'
        };
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Funzione per controllare lo stato di approvazione admin
  checkAdminStatus: async () => {
    try {
      const response = await axios.get(`${API_URL}check-admin-status/`);
      return {
        isApproved: response.data.is_approved,
        approvalDate: response.data.approval_date,
        message: response.data.message
      };
    } catch (error) {
      console.error('Admin status check error:', error);
      return {
        isApproved: false,
        message: 'Errore nel controllo dello stato di approvazione'
      };
    }
  },
  
  // Gestione dello stato di autenticazione
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
  
  // Logout migliorato
  logout: async () => {
    try {
      await axios.post(`${API_URL}logout/`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_type');
      localStorage.removeItem('user_data');
      sessionStorage.clear();
      delete axios.defaults.headers.common['Authorization'];
    }
  },
  
  // Verifica token
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
  
  // Refresh token
  refreshToken: async () => {
    try {
      const refresh = localStorage.getItem('refresh_token') || 
      sessionStorage.getItem('refresh_token');
      
      if (!refresh) throw new Error('No refresh token available');
      
      const response = await axios.post(`${API_URL}token/refresh/`, { refresh });
      
      if (response.data.access) {
        const storage = localStorage.getItem('refresh_token') ? 
        localStorage : sessionStorage;
        
        storage.setItem('access_token', response.data.access);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      }
      
      return response.data;
    } catch (error) {
      console.error('Token refresh error:', error);
      authService.logout();
      throw error;
    }
  },
  
  // Gestione social login (già presente e corretta)
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