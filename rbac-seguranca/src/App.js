import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './Components/UI/ProtectedRoute';
import Login from './Components/Auth/Login';
import BoardPanel from './Components/BoardPanel';
import TeachersPanel from './Components/TeachersPanel';
import StudentPanel from './Components/StudentPanel';