import React, { Component } from "react"; // Importa React y
    import "./estilos/App.css";
    import empleadosData from "./datos/empleados.json";
    import CmpEmpleados from "./componentes/CmpEmpleados";

class App extends Component {
    constructor(props) {
        super(props); // Llama adl constructor de la clase `Component`.
        this.state = {
            empleados: empleadosData, // Carga la lista de empleados desde el JSON.
            filtro: "todos", // Estado inicial del filtro: muestra todos los

        };
    }
    cambiarEstadoEmpleado = (id) => {
        this.setState((prevState) => ({
            empleados: prevState.empleados.map((empleado) =>
                empleado.id === id ? { ...empleado, activo: !empleado.activo } : empleado
            ),
        }));
    };
    // Función para actualizar el filtro
    cambiarFiltro = (event) => {
        this.setState({ filtro: event.target.value });
    };

    render() {
        const empleadosFiltrados = this.state.empleados.filter((empleado) => {
            if (this.state.filtro === "activos") return empleado.activo;
            if (this.state.filtro === "inactivos") return !empleado.activo;
            return true; // "todos" muestra todos
        });
        return (
            <div className="container">
                <h1>Gestor de Empleados</h1>
                )
                {/* Selector para filtrar empleados */}
                <label>Filtrar por estado: </label>
                <select onChange={this.cambiarFiltro} value={this.state.filtro}>
                    <option value="todos">Todos</option>
                    <option value="activos">Activos</option>
                    <option value="inactivos">Inactivos</option>
                </select>
                <CmpEmpleados empleados={empleadosFiltrados}
                              cambiarEstado={this.cambiarEstadoEmpleado} />
            </div>
        );
    }
}

export default App;
