import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './Components/UI/ProtectedRoute';
import Login from './Components/Auth/Login';
import BoardPanel from './Components/BoardPanel';
import TeachersPanel from './Components/TeachersPanel';
import StudentPanel from './Components/StudentPanel';
import Navbar from './Components/UI/Navbar';
import Unauthorizad from './Components/Unauthorized';
import './App.css';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Navbar />
                <Routes>
                    <Route path='/login' element={<Login />} /> {/* Rota Pública */}
                    <Route path='/nao-autorizado' element={<Unauthorizad />} /> {/* Rota de Erro */}

                    {/* Rotas Protegidas */}
                    <Route path='/diretoria' 
                    element={
                        <ProtectedRoute permission='gerenciar_usuarios'>
                            <BoardPanel />
                        </ProtectedRoute>
                    }/>

                    <Route path='/professor' 
                    element={
                        <ProtectedRoute permission='lancar_notas'>
                            <TeachersPanel />
                        </ProtectedRoute>
                    }/>

                    <Route path='/aluno' 
                    element={
                        <ProtectedRoute permission='visualizar_notas'>
                            <StudentPanel />
                        </ProtectedRoute>
                    }/>

                    {/* Rota padrão redireciona para login */}
                    <Route path='/' element={<Navigate to='/login' replace />} />

                    {/* Rota para págimas não encontradas */}
                    <Route path='*' element={<Navigate to='nao-encontrado' replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;