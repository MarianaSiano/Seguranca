import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, permission }) => {
    const { estaAutenticado, pode } = useAuth();

    if (!estaAutenticado())
        return <Navigate to="/login" replace />;

    if (permission && !pode(permission))
        return <Navigate to="/nao-autorizado" replace />;

    return children;
};

export default ProtectedRoute;