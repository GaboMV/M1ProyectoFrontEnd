import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../estilos/dasboard.css';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dueDateFilter, setDueDateFilter] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchTasks = async () => {
            setLoading(true);
            try {
                let url = 'http://localhost:3000/api/tasks';

                if (searchTerm) {
                    url = `http://localhost:3000/api/tasks/search/${searchTerm}`;
                } else if (statusFilter) {
                    url = `http://localhost:3000/api/tasks/status/${statusFilter}`;
                } else if (dueDateFilter) {
                    url = `http://localhost:3000/api/tasks/dueDate/${dueDateFilter}`;
                }

                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTasks(response.data);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setTasks([]);
                    setError(null);
                } else {
                    setError('No se pudieron obtener las tareas');
                }
            } finally {
                setLoading(false);
            }
        };

        const delayDebounce = setTimeout(() => {
            fetchTasks();
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, statusFilter, dueDateFilter, navigate]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setStatusFilter('');
        setDueDateFilter('');
    };

    const handleStatusFilter = (status) => {
        setStatusFilter(status);
        setSearchTerm('');
        setDueDateFilter('');
    };

    const handleDateChange = (e) => {
        const date = new Date(e.target.value).toISOString();
        setDueDateFilter(date);
        setSearchTerm('');
        setStatusFilter('');
    };

    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        setDueDateFilter('');
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:3000/api/tasks/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTasks((prev) => prev.filter((task) => task.id !== id));
        } catch (error) {
            alert('Error al eliminar la tarea');
        }
    };

    const openEditModal = (task) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedTask(null);
    };

    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        try {
            const { id, title, description, dueDate, status } = selectedTask;
            await axios.put(`http://localhost:3000/api/tasks/${id}`, {
                title, description, dueDate, status
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            setTasks((prev) =>
                prev.map((task) => (task.id === id ? selectedTask : task))
            );
            closeModal();
        } catch (error) {
            alert('Error al actualizar la tarea');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedTask((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <h3>Filtros</h3>
                <div className="filter-group">
                    <div className="search-container">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Buscar tarea..."
                            className="search-input"
                        />
                    </div>
                    <label>Estado:</label>
                    <button onClick={() => resetFilters()}>Ver Todo</button>
                    <button onClick={() => handleStatusFilter('pendiente')}>Pendiente</button>
                    <button onClick={() => handleStatusFilter('en progreso')}>En Proceso</button>
                    <button onClick={() => handleStatusFilter('completada')}>Completada</button>
                </div>
                <div className="filter-group">
                    <label>Fecha de vencimiento:</label>
                    <input type="date" onChange={handleDateChange} />
                </div>
            </div>

            <div className="main-content">
                {loading ? (
                    <div>Cargando tareas...</div>
                ) : error ? (
                    <div>{error}</div>
                ) : (
                    <ul>
                        {tasks.length === 0 ? (
                            <li>No tienes tareas.</li>
                        ) : (
                            tasks.map((task) => (
                                <li key={task.id}>
                                    <h3>{task.title}</h3>
                                    <p>{task.description}</p>
                                    <p>Fecha de creación: {task.createdAt}</p>
                                    <p>Fecha de vencimiento: {task.dueDate}</p>
                                    <p>Estado: {task.status}</p>
                                    {task.status === 'pendiente' && (
                                        <button className="edit" onClick={() => openEditModal(task)}>Editar</button>
                                    )}
                                    {task.status === 'en progreso' && (
                                        <button className="edit" onClick={() => openEditModal(task)}>Editar</button>
                                    )}
                                    {task.status === 'completada' && (
                                        <button className="delete-button" onClick={() => handleDelete(task.id)}>Eliminar</button>
                                    )}
                                </li>
                            ))
                        )}
                    </ul>
                )}
            </div>

            {showModal && selectedTask && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Editar tarea</h2>
                        <input
                            type="text"
                            name="title"
                            value={selectedTask.title}
                            onChange={handleChange}
                            placeholder="Título"
                        />
                        <textarea
                            name="description"
                            value={selectedTask.description}
                            onChange={handleChange}
                            placeholder="Descripción"
                        />
                        <input
                            type="date"
                            name="dueDate"
                            value={selectedTask.dueDate.split('T')[0]}
                            onChange={handleChange}
                        />
                        <select name="status" value={selectedTask.status} onChange={handleChange}>
                            <option value="pendiente">Pendiente</option>
                            <option value="en progreso">En progreso</option>
                            <option value="completada">Completada</option>
                        </select>
                        <div className="modal-buttons">
                            <button onClick={closeModal}>Cancelar</button>
                            <button onClick={handleUpdate}>Actualizar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
