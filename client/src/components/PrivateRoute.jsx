import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const { role } = JSON.parse(atob(token.split('.')[1]));

    // ✅ Only allow roles defined in allowedRoles
    if (!allowedRoles.includes(role)) {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch {
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;
