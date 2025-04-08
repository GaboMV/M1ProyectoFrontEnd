import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Para redirigir después del registro
import '../estilos/Register.css'; // Importar el archivo CSS

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Redirigir a la página de login tras registro

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:3000/api/auth/register', {
                name,
                email,
                password
            });
            setLoading(false);
            // Redirigir al login tras registro exitoso
            navigate('/login');
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
        <div className="register-container">
            <div className="register-box">
                <h2>Registrarse</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <label>Nombre:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
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
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>
                <div className="login-link">
                    <p>¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a></p>
                </div>
            </div>
        </div>
    );
};

export default Register;