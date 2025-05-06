import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ component: Component, permission, ...rest }) => {
    const { isAuthenticated, can } = useAuth();

    return (
        <Route {...rest} render={(props) => {
            if(!isAuthenticated())
                return <Redirect to="/login" />;

            if(permission && !can(permission))
                return <Redirect to="Não autorizado" />

            return <Component {...props} />
        }}
        />
    );
};

export default ProtectedRoute;