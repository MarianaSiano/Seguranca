import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" className="navbar-logo">
                    Sistema Escolar
                </Link>
            </div>

            {user && (
                <div className="navbar-user">
                    <span className="user-name">Olá, {user.name}</span>
                    <button onClick={handleLogout} className="logout-btn">
                        Sair
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;