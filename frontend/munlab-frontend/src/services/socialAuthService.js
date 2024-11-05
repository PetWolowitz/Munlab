import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/users/';

export const socialAuthService = {
  // Google auth usando @react-oauth/google
  handleGoogleLogin: async (credential) => {
    try {
      const response = await axios.post(API_URL + 'google/', {
        credential
      });
      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('user_type', 'user');
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Facebook auth usando SDK ufficiale
  handleFacebookLogin: async (response) => {
    try {
      const { accessToken } = response;
      const apiResponse = await axios.post(API_URL + 'facebook/', {
        access_token: accessToken
      });
      if (apiResponse.data.access) {
        localStorage.setItem('access_token', apiResponse.data.access);
        localStorage.setItem('user_type', 'user');
      }
      return apiResponse.data;
    } catch (error) {
      throw error;
    }
  }
};