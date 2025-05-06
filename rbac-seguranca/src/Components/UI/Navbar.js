import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
    const { usuario, isAuthenticated, logout } = useAuth();
    const history = useHistory();

    const handleLogout = async () => {
        try {
            await logout();
            history.push('/login');
        } catch(error) {
            console.error('Erro ao fazer logout: ', error);
        }
    };

    return (
        <nav className='navbar'>
            <div className='navbar-brand'>
                <Link to='/' className='navbar-logo'>Sistema Escolar</Link>
            </div>

            { isAuthenticated() && (
                <div className='navbar-links'>
                    {/* Links com base no papel do usuário */}
                    {User.role === 'diretoria' && (
                        <>
                            <Link to='/diretoria' className='nav-link'>Painel Diretoria</Link>
                            <Link to='/gerenciar-professores' className='nav-link'>Professores</Link>
                            <Link to='/gerenciar-alunos' className='nav-link'>Alunos</Link>
                        </>
                    )}

                    {user.role === 'professor' && (
                        <>
                            <Link to='/professor' className='nav-link'>Painel Professor</Link>
                            <Link to='/minhas-turmas' className='nav-link'>Minhas Turmas</Link>
                            <Link to='/lancar-notas' className='nav-link'>Lançar Notas</Link>
                        </>
                    )}

                    {user.role === 'aluno' && (
                        <>
                            <Link to='/aluno' className='nav-link'>Painel Aluno</Link>
                            <Link to='/minhas-notas' className='nav-link'>Minhas Notas</Link>
                            <Link to='/horario-aulas' className='nav-link'>Horário</Link>
                        </>
                    )}

                    <button onClick={handleLogout} className='nav-link logout-btn'>Sair</button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;