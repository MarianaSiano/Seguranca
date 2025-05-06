import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
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
                <div className='App'>
                    <Navbar />
                    <Switch>
                        <Route path='/login' component={Login} />
                        <Route path='/nao-autorizado' component={Unauthorizad} />

                        <ProtectedRoute 
                        path='/diretoria'
                        component={BoardPanel}
                        permissao='gerenciar_usuarios'
                        />

                        <ProtectedRoute 
                        path='/professor'
                        component={TeachersPanel}
                        permissao='lancar_notas'
                        />

                        <ProtectedRoute 
                        path='/aluno'
                        component={StudentPanel}
                        permissao='visualizar_notas'
                        />

                        <Route exact path='/'>
                            <Redirect to='/login' />
                        </Route>
                    </Switch>
                </div>
            </AuthProvider>
        </Router>
    );
};

export default App;