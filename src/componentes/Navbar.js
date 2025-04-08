import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext'; // Importa el hook useAuth

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth(); // Usa el hook para obtener el estado de autenticación

    const handleLogout = () => {
        logout(); // Elimina el token del almacenamiento local y actualiza el estado
        window.location.reload(); // Recarga la página para que el Navbar se actualice
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">TaskManager</div>
            <div className="navbar-links">
                <Link to="/">Inicio</Link>
                {isAuthenticated ? (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/" onClick={handleLogout}>Cerrar sesión</Link>
                    </>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </div>
        </nav>
    );
};
export default Navbar;