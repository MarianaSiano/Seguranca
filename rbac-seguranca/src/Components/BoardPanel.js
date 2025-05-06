import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const BoardPanel = () => {
    const { usuario } = useAuth();

    return (
        <div className='panel'>
            <h2>Painel da Diretoria</h2>
            <p>Bem-Vindo(a), {usuario?.nome}!</p>
            
            <div className='recursos'>
                <button>Gerenciar Professores</button>
                <button>Gerenciar Alunos</button>
                <button>Emitir Relatórios</button>
                <button>Configurações da Escola</button>
            </div>
        </div>
    );
};

export default BoardPanel;