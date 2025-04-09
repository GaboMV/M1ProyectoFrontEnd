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
    const [showAddModal, setShowAddModal] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });
    const navigate = useNavigate();
    const [sidebarVisible, setSidebarVisible] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const delayDebounce = setTimeout(() => {
            fetchTasks();
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, statusFilter, dueDateFilter, navigate]);

    const fetchTasks = async () => {
        const token = localStorage.getItem('token');
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
            setError(null);
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
        const date = new Date(e.target.value);
        if (isNaN(date.getTime())) {
            // Fecha inválida
            setDueDateFilter('');
            return;
        }

        // Formatea la fecha a YYYY-MM-DD sin hora
        const formattedDate = date.toISOString().split('T')[0];
        setDueDateFilter(formattedDate);
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
    const formatDate = (dateString) => {
        if (!dateString) return 'Sin fecha';

        const date = new Date(dateString);
        // Ajuste para compensar la zona horaria
        const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

        return adjustedDate.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
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

    const openAddModal = () => {
        setShowAddModal(true);
    };

    const closeAddModal = () => {
        setShowAddModal(false);
        setNewTask({ title: '', description: '', dueDate: '' });
    };

    const handleAddChange = (e) => {
        const { name, value } = e.target;
        setNewTask((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddTask = async () => {
        const token = localStorage.getItem('token');
        try {
            const dueDate = new Date(newTask.dueDate);
            dueDate.setDate(dueDate.getDate() + 1);

            await axios.post('http://localhost:3000/api/tasks', {
                title: newTask.title,
                description: newTask.description,
                dueDate: dueDate.toISOString().split('T')[0],
                status: 'pendiente'
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            await fetchTasks();
            closeAddModal();
        } catch (error) {
            alert('Error al agregar la tarea');
        }
    };


    return (


        <div className="dashboard-container">
            <button className="menu-toggle" onClick={() => setSidebarVisible(!sidebarVisible)}>
                ☰ Menú
            </button>
            <div className={`sidebar ${sidebarVisible ? 'show' : ''}`}>
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
                    <button className="list-button" onClick={() => resetFilters()}>Ver Todo</button>
                    <button className="list-button" onClick={() => handleStatusFilter('pendiente')}>Pendiente</button>
                    <button className="list-button" onClick={() => handleStatusFilter('en progreso')}>En Proceso</button>
                    <button className="list-button" onClick={() => handleStatusFilter('completada')}>Completada</button>
                </div>
                <div className="filter-group">
                    <label>Fecha de vencimiento:</label>
                    <input type="date" className="date-input" onChange={handleDateChange} />
                </div>
                <button className="add-task-button" onClick={openAddModal}>
                    Agregar nueva tarea
                </button>
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
                                <li key={task.id} className="task-item">
                                    <h3>{task.title}</h3>
                                    <p>{task.description}</p>
                                    <p>Fecha de creación: {new Date(task.createdAt).toLocaleDateString()}</p>
                                    <p>Fecha de vencimiento: {formatDate(task.dueDate)}</p>
                                    <p>Estado: {task.status}</p>
                                    {task.status === 'pendiente' && (
                                        <button className="edit" onClick={() => openEditModal(task)}>Editar</button>
                                    )}
                                    {task.status === 'en progreso' && (
                                        <button className="edit" onClick={() => openEditModal(task)}>Editar</button>
                                    )}
                                    {task.status === 'completada' && (
                                        <button className="delete-button-dashboard" onClick={() => handleDelete(task.id)}>Eliminar</button>
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
                            className="modal-input"
                            type="text"
                            name="title"
                            value={selectedTask.title}
                            onChange={handleChange}
                            placeholder="Título"
                        />
                        <textarea
                            className="modal-input"
                            name="description"
                            value={selectedTask.description}
                            onChange={handleChange}
                            placeholder="Descripción"
                        />
                        <input
                            className="modal-input"
                            type="date"
                            name="dueDate"
                            value={selectedTask.dueDate.split('T')[0]}
                            onChange={handleChange}
                        />
                        <select name="status" className="modal-select" value={selectedTask.status} onChange={handleChange}>
                            <option value="pendiente">Pendiente</option>
                            <option value="en progreso">En progreso</option>
                            <option value="completada">Completada</option>
                        </select>
                        <div className="modal-buttons">
                            <button className="add-button" onClick={handleUpdate}>Actualizar</button>
                            <button className="add-delete-button" onClick={closeModal}>Cancelar</button>

                        </div>
                    </div>
                </div>
            )}

            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Agregar nueva tarea</h2>
                        <input
                            className="modal-input"
                            type="text"
                            name="title"
                            value={newTask.title}
                            onChange={handleAddChange}
                            placeholder="Título"
                        />
                        <textarea
                            className="modal-input"
                            name="description"
                            value={newTask.description}
                            onChange={handleAddChange}
                            placeholder="Descripción"
                        />
                        <input
                            className="modal-input"
                            type="date"
                            name="dueDate"
                            value={newTask.dueDate}
                            onChange={handleAddChange}
                        />
                        <div className="modal-buttons">
                            <button className="add-button" onClick={handleAddTask}>Agregar</button>
                            <button className="add-delete-button" onClick={closeAddModal}>Cancelar</button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;