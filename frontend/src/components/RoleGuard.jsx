import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const RoleGuard = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  
  if (!allowedRoles.includes(user.role)) {
    
    let fallbackRoute = '/';
    if (user.role === 'STUDENT') fallbackRoute = '/student/dashboard';
    if (user.role === 'RECRUITER') fallbackRoute = '/recruiter/dashboard';
    if (user.role === 'ADMIN') fallbackRoute = '/admin/dashboard';

    return <Navigate to={fallbackRoute} replace />;
  }

  return children;
};

export default RoleGuard;
