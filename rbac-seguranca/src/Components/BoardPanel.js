import React from 'react';
import Navbar from './UI/Navbar';
import { useAuth } from '../contexts/AuthContext';
import './BoardPanel.css';

const BoardPanel = () => {
    const { usuario } = useAuth();

    return (
        <div className='panel'>
            <Navbar />
            <h2>Painel da Diretoria</h2>
            <p>Bem Vindo(a), {usuario?.nome}!</p>
            
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