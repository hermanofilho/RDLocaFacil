import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { isAuthenticated, isAdmin } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If admin access required but user is not admin
  if (adminOnly && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Otherwise render the child components
  return <>{children}</>;
};

export default ProtectedRoute;
