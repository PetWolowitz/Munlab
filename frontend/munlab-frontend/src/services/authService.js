import axios from 'axios';
import { sanitizeInput } from '../utils/securityUtils';

const API_URL = 'http://127.0.0.1:8000/api/users/';

// Configurazione di Axios
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

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
  login: async (username, password, userType) => {
    if (!username || !password) {
      throw new Error('Username e password sono richiesti');
    }

    const sanitizedUsername = sanitizeInput(username);
    
    try {
      const response = await axios.post(
        API_URL + 'login/', 
        {
          username: sanitizedUsername,
          password: password,
          user_type: userType
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
      );
      
      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('user_type', userType);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

register: async (userData, userType) => {
  const sanitizedData = {
    username: sanitizeInput(userData.username),
    email: sanitizeInput(userData.email),
    password: userData.password,
    user_type: userType,
    first_name: sanitizeInput(userData.firstName),
    last_name: sanitizeInput(userData.lastName)
  };

  try {
    const response = await axios.post(
      API_URL + 'register/',
      sanitizedData,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
},

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_type');
    delete axios.defaults.headers.common['Authorization'];
  },

  verifyToken: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return false;

    try {
      await axios.post(API_URL + 'verify/', { token });
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
  }
};

export default authService;