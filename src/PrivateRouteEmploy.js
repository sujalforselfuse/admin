import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRouteEmploy = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('ratnaemploytoken');
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/signup" state={{ from: location }} />;
  }

  return children;
};

export default PrivateRouteEmploy;
