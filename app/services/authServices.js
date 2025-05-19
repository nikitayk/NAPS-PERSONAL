import axios from 'axios';

// Use the API base URL from .env
const API_URL = process.env.REACT_APP_API_URL;

// Helper to get the JWT from localStorage
const getToken = () => localStorage.getItem('token');

// Helper to set up headers with JWT for protected requests
const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

// Register a new user
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

// Login user and store token
export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  // Store token (and optionally refreshToken) in localStorage
  if (response.data?.data?.accessToken) {
    localStorage.setItem('token', response.data.data.accessToken);
    // If you use refresh tokens, store them as well:
    // localStorage.setItem('refreshToken', response.data.data.refreshToken);
  }
  return response.data;
};

// Logout user (remove tokens)
export const logout = () => {
  localStorage.removeItem('token');
  // localStorage.removeItem('refreshToken');
};

// Get current user info (protected route)
export const getCurrentUser = async () => {
  const response = await axios.get(`${API_URL}/users/me`, authHeaders());
  return response.data;
};

// Refresh token (if your backend supports it)
export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
  if (response.data?.data?.accessToken) {
    localStorage.setItem('token', response.data.data.accessToken);
  }
  return response.data;
};

