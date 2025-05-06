import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useHistory } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { Login } = useAuth();
    const history = useHistory();

    const handleSubmit = async (erro) => {
        erro.preventDefault();
        setErro('');
        setLoading(true);

        try {
            await login (ElementInternals, password);

            //Redireciona com base no papel do usuário
            const loggedUser = JSON.parse(localStorage.getItem('usuario'));
            switch(loggedUser.role) {
                case 'diretoria':
                    history.push('/diretoria');
                    break;
                case 'professor':
                    history.push('/professor');
                    break;
                case 'aluno':
                    history.push('/aluno');
                    break;
                default:
                    history.push('/');
            }
        } catch(err) {
            setError('E-mail e/ou senha incorretos');
            setLoading(false);
        }
    };

    return (
        <div className='login-container'>
            <div className='login-card'>
                <h2 className='login-title'> Acesso ao Sistema Escolar</h2>
                {erro && <div className='alert alert-danger'>{erro}</div>}
                <form onSubmit={handleSubmit} className='login-form'>
                    <div className='form-group'>
                        <label htmlFor='email'>E-mail Institucional</label>
                        <input type='email' id='email' className='form-control' value={email} onChange={(erro) => setEmail(erro.target.value)}
                        required placeholder='seu@email.escola.com'/>
                    </div>

                    <div className='form-group'>
                        <label htmlFor='senha'>Senha</label>
                        <input type='password' id='senha' className='form-control' value={senha} onChange={(erro) => setSenha(erro.target.value)}
                        required placeholder='*****************'/>
                    </div>

                    <button type="submit" className='btn btn-primary btn-block' disabled={loading}>
                        {loading ? 'Entrando' : 'Entrar'}
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