import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await login(email, password);

            //Redireciona com base no papel (role) do usuário
            switch (user.roles[0]) { //Assumindo que roles é um array
                case 'diretoria':
                    navigate('/diretoria');
                    break;
                case 'professor':
                    navigate('/professor');
                    break;
                case 'aluno':
                    navigate('/aluno');
                    break;
                default:
                    navigate('/');
            }

        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Login</h2>
                {error && <div className="alert-danger">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>E-mail:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="seu_email@escola.com"
                        />
                    </div>

                    <div className="form-group">
                        <label>Senha:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="senha"
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;