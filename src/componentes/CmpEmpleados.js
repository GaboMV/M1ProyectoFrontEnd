import React, { Component } from "react";
import CmpEmpleado from "./CmpEmpleado"; // Importamos el componente individual
class CmpEmpleados extends Component {
    render() {
        const { empleados, cambiarEstado } = this.props; // Extraemos empleados y

// Validamos si no hay empleados
        if (!empleados || empleados.length === 0) {
            return <p>No hay empleados disponibles.</p>;
        }
        return (
            <div>
                <h2>Lista de Empleados</h2>
                {empleados.map((empleado) => (
                    <CmpEmpleado key={empleado.id} empleado={empleado}
                                 cambiarEstado={cambiarEstado} />
                ))}
            </div>
        );
    }
}
export default CmpEmpleados;