import React from 'react';
import { Link } from 'react-router-dom';
import { userAuth } from '../contexts/AuthContext';

const Unauthorized = () => {
    const { usuario } = userAuth();
}