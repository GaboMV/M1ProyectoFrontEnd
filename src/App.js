// src/App.js
import React, {useEffect, useState} from 'react';
import estilo from './estilos/estilo.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import Navbar from './componentes/Navbar';
import Login from './Paginas/Login';
import Register from './Paginas/Register';
import Dashboard from './Paginas/Dashboard';
import Home from './Paginas/Home';
function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Verificar si el token está en el localStorage para determinar si el usuario está autenticado
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true); // Cuando el usuario inicie sesión
    };

    const handleLogout = () => {
        setIsAuthenticated(false); // Cuando el usuario cierre sesión
        localStorage.removeItem('token');
    };
    return (

        <AuthProvider>
            <div className={estilo.container}>
            {/* Aquí va tu Navbar, rutas, etc. */}
            <Router>
                <Navbar isAuthenticated={isAuthenticated}
                        onLogout={handleLogout} />
                <Routes>
                    <Route path="/" element={<Home />} />

                    <Route
                        path="/login"
                        element={<Login onLogin={handleLogin} />}
                    />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard isAuthenticated={isAuthenticated} />}
                    />
                </Routes>
            </Router>
        </div>
        </AuthProvider>

    );
}


export default App;