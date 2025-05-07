import React, { useState } from 'react';
import { UNSAFE_NavigationContext, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate(); //Substitui useHistory

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');
        setLoading(true);

        try {
            await login(email, password);

            //Redireciona com base no papel do usuario
            const loggedUser = JSON.parse(localStorage.getItem('usuario'));
            switch(loggedUser.role) {
                case 'diretoria' :
                    navigate('/diretoria'); //Substitui history.push
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
        } catch(err) {
            setErro('E-mail e/ou senha incorretos');
            setLoading(false);
        }
    };

    return (
        <div className='login-container'>
            <div className='login-card'>
                <h2 className='login-title'>Acesso ao Sistema Escolar</h2>

                {erro && <div className='alert alert-danger'>{erro}</div>}

                <form onSubmit={handleSubmit} className='login-form'>
                    <div className='form-group'>
                        <label htmlFor='email'>E-mail Institucional: </label>
                        <input
                        type='email'
                        id='email'
                        className='form-control'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder='seu@email.escola.com' />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='password'>Senha: </label>
                        <input
                        type='password'
                        id='password'
                        className='form-control'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder='*************' />
                    </div>

                    <button
                    type='submit'
                    className='btn btn-primary btn-block'
                    disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <div className='login-footer'>
                    <p className='text-center'>
                        Problemas com acesso? <a href='/contato'>Contate a administração</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;