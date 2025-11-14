import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactElement;
  requireAuth?: boolean;
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = false, 
  requiredRoles = [] 
}) => {
  const { isLoggedIn, isLoading, hasRole } = useAuth();

  // Wait for auth to finish loading before redirecting
  if (isLoading) {
    return null; // Or you could return a loading spinner here
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !isLoggedIn) {
    return <Navigate to="/books" replace />;
  }

  // If specific roles are required but user doesn't have them
  if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    return <Navigate to="/books" replace />;
  }

  return children;
};

export default ProtectedRoute;
