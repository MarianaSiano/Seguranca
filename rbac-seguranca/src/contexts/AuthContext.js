import React, { createContext, userState, useContext } from 'react';
import { login as apiLogin, logout as apiLogout } from '../api/auth';
import { hasPermission } from '../api/rbac';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (email, password) => {
        try {
            const userData = await apiLogin(email, password);
            setUser(userData);
            return userData;
        } catch(error){
            throw error;
        }
    };

    const logout = async () => {
        await apiLogin();
        setUser(null);
    };

    const isAuthenticated = () => {
        return user;
    };

    const can = (permission) => {
        if(!user)
            return false;

        return hasPermission(user.roles, permission);
    };

    return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, can }}>
        {children}
    </AuthContext.Provider>);
};

export const useAuth = () => {
    return useContext(AuthContext);
}