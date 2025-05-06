import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const TeachersPanel = () => {
    const { usuario } = useAuth();

    return (
        <div className='panel'>
            <h2>Painel do Professor</h2>
            <p>Bem Vindo(a), {usuario?.nome}!</p>

            <div className='recursos'>
                <button>Minhas Turmas</button>
                <button>Lançar Notas</button>
                <button>Planejar Aulas</button>
                <button>Comunicados</button>
            </div>
        </div>
    );
};

export default TeachersPanel;