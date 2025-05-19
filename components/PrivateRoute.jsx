import React from 'react';
import { Navigate } from 'react-router-dom';

// Usage: <PrivateRoute><Dashboard /></PrivateRoute>
export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}
