import React from 'react';

const IncidentListItem = ({ incident }) => {
    // TODO Implementar los estilos correspondientes
    const liStyle = ``;
    const nombreStyle = ``;
    const descripcionStyle = ``;
    const fechaYHoraStyle = ``;
    return (
        <li className={liStyle}>
            <span className={nombreStyle}>{incident.nombre}</span>
            <span className={descripcionStyle}>{incident.descripcion}</span>
            <span className={fechaYHoraStyle}>{incident.fechaYHora}</span>
        </li>
    );
};

export default IncidentListItem;
