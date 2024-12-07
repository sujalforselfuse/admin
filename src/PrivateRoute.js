import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('ratnatoken');
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/signup" state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoute;
