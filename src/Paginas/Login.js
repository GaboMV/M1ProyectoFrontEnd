import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../estilos/login.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                email,
                password
            });
            const token = response.data.token;
            localStorage.setItem('token', token);
            login(token);
            setLoading(false);
            navigate('/dashboard');
        } catch (err) {
            setLoading(false);
            if (err.response) {
                setError(err.response.data.error);
            } else {
                setError('Ocurrió un error. Intenta de nuevo.');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Iniciar sesión</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-container">
                        <label>Contraseña:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" disabled={loading}>
                        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </button>
                </form>
                <div className="signup-link">
                    <p>¿No tienes una cuenta? <Link to="/register">Crea una aquí</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;