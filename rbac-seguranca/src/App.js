import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './Components/UI/ProtectedRoute';
import Login from './Components/Auth/Login';
import BoardPanel from './Components/BoardPanel';
import TeachersPanel from './Components/TeachersPanel';
import StudentPanel from './Components/StudentPanel';
import Unauthorized from './Components/Unauthorized';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/nao-autorizado" element={<Unauthorized />} />

                    <Route path="/diretoria" element={
                        <ProtectedRoute requiredRole="diretoria">
                            <BoardPanel />
                        </ProtectedRoute>
                    } />

                    <Route path="/professor" element={
                        <ProtectedRoute requiredRole="professor">
                            <TeachersPanel />
                        </ProtectedRoute>
                    } />

                    <Route path="/aluno" element={
                        <ProtectedRoute requiredRole="aluno">
                            <StudentPanel />
                        </ProtectedRoute>
                    } />

                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;