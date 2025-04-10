import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import '../estilos/navbar.css';
import axios from 'axios';

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
    const [userName, setUserName] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await axios.get(`${API_BASE_URL}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserName(response.data.name);
            } catch (error) {
                console.error('Error al obtener los datos del usuario:', error);
            }
        }
    };

    useEffect(() => {
        if (isAuthenticated) fetchUserData();
    }, [isAuthenticated]);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        window.location.reload();
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    // Cerrar menú al cambiar tamaño de pantalla
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) setIsMenuOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-logo">TaskManager</div>

            {isAuthenticated && (
                <span className="user-name">Hola, {userName}</span>
            )}

            <button className="hamburger" onClick={toggleMenu}>
                ☰
            </button>

            <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
                <Link to="/" onClick={closeMenu}>Inicio</Link>
                {isAuthenticated ? (
                    <>
                        <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
                        <Link to="/" onClick={handleLogout}>Cerrar sesión</Link>

                    </>
                ) : (
                    <>
                    <Link to="/login" onClick={closeMenu}>Log-in</Link>
                    <Link to="/register" onClick={closeMenu}>Sign-in</Link>
                    </>
                )

                }
            </div>
        </nav>
    );
};

export default Navbar;