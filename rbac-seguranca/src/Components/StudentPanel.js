import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './StudentPanel.css';

const StudentPanel = () => {
    const { usuario } = useAuth();

    return (
        <div className="panel">
            <h2>Painel do Aluno</h2>
            <p>Bem-vindo(a), {usuario?.nome}!</p>
            <div className="recursos">
                <button>Ver Minhas Notas</button>
                <button>Horário de Aulas</button>
                <button>Materiais de Estudo</button>
                <button>Eventos Escolares</button>
            </div>
        </div>
    );
};

export default StudentPanel;