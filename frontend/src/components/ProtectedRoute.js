import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, isAuthenticated, requiredRole }) {
  const user = JSON.parse(localStorage.getItem('hub_user') || '{}');
  const roles = Array.isArray(user.roles)
    ? user.roles.map((role) => String(role))
    : (user.role ? [user.role] : []);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && !roles.includes(requiredRole)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default ProtectedRoute;
