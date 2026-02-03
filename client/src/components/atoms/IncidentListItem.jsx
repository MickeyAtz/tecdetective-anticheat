import React from 'react';

const IncidentListItem = ({ incident }) => {
    const contenedorStyle = `flex flex-col`;
    const liStyle = `flex justify-between items-center py-2 border-b border-border-primary last:border-0`;
    const nombreStyle = `font-medium text-sm text-text-primary`;
    const descripcionStyle = `text-xs text-text-secondary`;
    const fechaYHoraStyle = `text-xs font-mono text-text-tertiary`;

    return (
        <li className={liStyle}>
            <div className={contenedorStyle}>
                <span className={nombreStyle}>{incident.nombre}</span>
                <span className={descripcionStyle}>{incident.descripcion}</span>
            </div>
            <span className={fechaYHoraStyle}>{incident.fechaYHora}</span>
        </li>
    );
};

export default IncidentListItem;
