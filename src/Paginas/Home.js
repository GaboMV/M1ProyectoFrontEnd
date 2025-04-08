import React from 'react';
import estilo from '../estilos/estilo.css';

const Home = () => {
    return (
        <div className={estilo.home}>
            <header className={estilo.header}>
                <h1>Welcome to TaskManager</h1>
                <p>Organize your tasks, focus your productivity, and meet your goals.</p>
            </header>

            <section className={estilo.features}>
                <div className={estilo.card}>
                    <h3>Create Tasks</h3>
                    <p>Easily add new tasks with deadlines and descriptions.</p>
                </div>
                <div className={estilo.card}>
                    <h3>Track Progress</h3>
                    <p>See your pending and completed tasks at a glance.</p>
                </div>
                <div className={estilo.card}>
                    <h3>Stay Organized</h3>
                    <p>Group tasks and filter by status and due dates.</p>
                </div>
            </section>
        </div>
    );
};

export default Home;