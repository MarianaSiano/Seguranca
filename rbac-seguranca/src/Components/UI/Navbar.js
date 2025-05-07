import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch(error) {
            console.error('Erro ao fazer logout: ', error);
        }
    };

    return (
        <nav className='navbar'>
            <div className='navbar-brand'>
                <Link to='/' className='navbar-logo'>Sistema Escolar</Link>
            </div>

            {isAuthenticated() && (
                <div className='navbar-links'>
                    <button onClick={handleLogout} className='nav-link logout-btn'>Sair</button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;