
import React from 'react';
import { Link } from 'react-router-dom';
import '../estilos/home.css';

const Home = () => {
    return (
        <div className="premium-home-container">
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Administrador de tareas</h1>
                    <p className="hero-subtitle">Ten controladas todas tus tareas y responsabilidades</p>

                    <div className="trust-badges">
                        <span>Ofrecemos el mejor servicio para tener tus tareas en orden</span>

                    </div>   </div>

            </section>
            {/* Features Section */}
            <section className="features-section">
                <h2 className="section-title">Tenemos lo que necesitas</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🚀</div>
                        <h3>Filtrado por fechas</h3>
                        <p>Puedes filtrar tus tareas por la fecha que quieras</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Filtrado por estado</h3>
                        <p>Puedes organizar tus tareas dependiendo del estado en el que se encuentren</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🤝</div>
                        <h3>edita y crea nuevas tareas</h3>
                        <p>Puedes ingresar todas tus tareas y tener control sobre ellas</p>
                    </div>

                </div>
            </section>
        </div>

    );
};

export default Home;