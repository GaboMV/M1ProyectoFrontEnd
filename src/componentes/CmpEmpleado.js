import React from "react";
import "../estilos/App.css";
function CmpEmpleado({ empleado, cambiarEstado }) {
    return (
        <div className={`empleado-card ${empleado.activo ? "activo" : "inactivo"}`}>
            <p>
                <strong>{empleado.apellido} {empleado.nombre}</strong>
            </p>
            <p>Cargo: {empleado.cargo}</p>
            <p>Estado: <span className={empleado.activo ? "estado-activo" : "estadoinactivo"}>
{empleado.activo ? "Activo " : "Inactivo "}
</span></p>
            <button className="cambiar-estado-btn" onClick={() =>
                cambiarEstado(empleado.id)}>
                Cambiar Estado
            </button>
        </div>
    );
}
export default CmpEmpleado;