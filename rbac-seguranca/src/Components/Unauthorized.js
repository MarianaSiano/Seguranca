import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Unauthorized = () => {
    const { usuario } = useAuth();

    return (
        <div className='unauthorized-container'>
            <div className='unauthorized-card'>
                <h1>Acesso Negado</h1>
                <p>Você não tem permissão para acessar esta página</p>

                <div className='user-info'>
                    <p>Usuário: <strong>{usuario?.nome}</strong></p>
                    <p>Perfil: <strong>
                        {usuario?.role === 'diretoria' && 'Diretoria'}
                        {usuario?.role === 'professor' && 'Professor'}
                        {usuario?.role === 'aluno' && 'Aluno'}
                    </strong></p>
                </div>

                <div className='action-buttons'>
                    {usuario ? (
                        <Link to={usuario.role === 'diretoria' ? '/diretoria' :
                            usuario.role === 'professor' ? '/professor' : '/aluno'}
                            className="btn btn-primary">
                            Voltar ao seu painel
                        </Link>
                    ) : (
                        <Link to="/login" className="btn btn-primary">
                            Fazer login
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;