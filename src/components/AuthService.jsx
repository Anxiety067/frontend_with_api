import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://gis-be-dev.gallimap.com';

class AuthService {
  constructor() {
    this.setupInterceptors();
  }

  // Create axios instance with default configurations
  axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  // Login method
  async login(identifier, password) {
    try {
      const response = await this.axiosInstance.post('/api/v1/login', {
        identifier,
        password
      });

      // Store the JWT token
      if (response.data.token) {
        this.setToken(response.data.token);
      }

      return response.data;
    } catch (error) {
      this.handleError(error, 'Login failed');
    }
  }

  // Signup method
  async signup(userData) {
    try {
      const response = await this.axiosInstance.post('/api/v1/signup', userData);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Signup failed');
    }
  }

  // Password reset request
  async forgotPassword(email) {
    try {
      const response = await this.axiosInstance.post('/api/v1/forgot-password', { email });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Password reset request failed');
    }
  }

  // Logout method
  logout() {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
  }

  // Token management methods
  setToken(token) {
    localStorage.setItem('user_token', token);
  }

  getToken() {
    return localStorage.getItem('user_token');
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    return !!token; // Returns true if token exists
  }

  // Store user data
  setUserData(userData) {
    localStorage.setItem('user_data', JSON.stringify(userData));
  }

  // Get user data
  getUserData() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  // Error handling method
  handleError(error, defaultMessage) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage = error.response.data.message || 
                           error.response.data.error || 
                           defaultMessage;
      throw new Error(errorMessage);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response received from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(defaultMessage);
    }
  }

  // Interceptor to add token to all requests
  setupInterceptors() {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      config => {
        const token = this.getToken();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor for handling common response scenarios
    this.axiosInstance.interceptors.response.use(
      response => response,
      error => {
        // Handle specific error scenarios
        if (error.response && error.response.status === 401) {
          // Token might be expired, logout user
          this.logout();
          // Optionally redirect to login page
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }
}

// Create an instance of AuthService to resolve ESLint warning
const authService = new AuthService();

// Export the instance as the default export
export default authService;