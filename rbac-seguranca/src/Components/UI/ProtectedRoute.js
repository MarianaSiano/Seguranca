import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, user } = useAuth();

    if(!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    if(requiredRole && !user.roles.includes(requiredRole)) {
        return <Navigate to="/nao-autorizado" replace />;
    }

    return children;
};

export default ProtectedRoute;