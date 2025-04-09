
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

        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
    };
    return (

        <AuthProvider>
            <div className={estilo.container}>

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