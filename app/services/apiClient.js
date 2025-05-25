// src/utils/apiClient.ts

import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://your-backend-url.com/api",
  timeout: 5000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (optional: redirect to login)
      console.error("Unauthorized access - redirecting to login");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
