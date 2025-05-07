import React, { createContext, useState, useContext } from 'react';
import { login as apiLogin, logout as apiLogout } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        //Recupera o usuário do localStorage se existir
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = async (email, password) => {
        try {
            const userData = await apiLogin(email, password);

            //Salva no state e no localStorage
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));

            return userData;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await apiLogout();
            setUser(null);
            localStorage.removeItem('user');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    const isAuthenticated = () => user;

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);