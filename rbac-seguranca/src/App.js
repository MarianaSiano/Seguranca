import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './Components/UI/ProtectedRoute';
import Navbar from './Components/UI/Navbar';
import Login from './Components/Auth/Login';
import BoardPanel from './Components/BoardPanel';
import TeachersPanel from './Components/TeachersPanel';
import StudentPanel from './Components/StudentPanel';
import Unauthorized from './Components/Unauthorized';
import './App.css';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="App">
                    <Navbar />
                    <Routes>
                        {/* Rota pública */}
                        <Route path="/login" element={<Login />} />

                        {/* Rota de erro */}
                        <Route path="/nao-autorizado" element={<Unauthorized />} />

                        {/* Rotas protegidas */}
                        <Route
                            path="/diretoria"
                            element={
                                <ProtectedRoute permission="gerenciar_usuarios">
                                    <BoardPanel />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/professor"
                            element={
                                <ProtectedRoute permission="lançar_notas">
                                    <TeachersPanel />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/aluno"
                            element={
                                <ProtectedRoute permission="visualizar_notas">
                                    <StudentPanel />
                                </ProtectedRoute>
                            }
                        />

                        {/* Rota padrão redireciona para login */}
                        <Route path="/" element={<Navigate to="/login" replace />} />

                        {/* Rota curinga para páginas não encontradas */}
                        <Route path="*" element={<Navigate to="/nao-autorizado" replace />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;