import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext'; // Importa el hook useAuth
import '../estilos/navbar.css';
import axios from 'axios';

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth(); // Usa el hook para obtener el estado de autenticación
    const [userName, setUserName] = useState(''); // Estado para guardar el nombre del usuario

    // Función para obtener los datos del usuario desde el backend
    const fetchUserData = async () => {
        const token = localStorage.getItem('token'); // Obtener el token desde el almacenamiento local

        if (token) {
            try {
                const response = await axios.get('http://localhost:3000/api/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Pasar el token en el encabezado
                    },
                });
                setUserName(response.data.name); // Guardar el nombre del usuario en el estado
            } catch (error) {
                console.error('Error al obtener los datos del usuario:', error);
            }
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchUserData(); // Solo hacer la solicitud si el usuario está autenticado
        }
    }, [isAuthenticated]); // Se ejecutará cuando el estado de autenticación cambie

    const handleLogout = () => {
        logout(); // Elimina el token del almacenamiento local y actualiza el estado
        window.location.reload(); // Recarga la página para que el Navbar se actualice
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">TaskManager</div>
            <div className="navbar-links">

                {isAuthenticated ? (
                    <>
                        <span className="user-name">Hola, {userName}</span> {/* Muestra el nombre del usuario */}
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/" onClick={handleLogout}>Cerrar sesión</Link>
                    </>
                ) : (
                    <Link to="/register">Sign-in</Link>

                )

                }
            </div>
        </nav>
    );
};

export default Navbar;