import React from 'react';

const IncidentListItem = ({ incident }) => {
    const contenedorStyle = `flex flex-col`;
    const liStyle = `flex justify-between items-center py-2 border-b border-border-primary/20 last:border-0`;
    const nombreStyle = `font-semibold text-xs text-text-primary uppercase tracking-tight`;
    const descripcionStyle = `text-[11px] text-text-tertiary mt-0.5`;
    const fechaYHoraStyle = `text-[10px] font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full`;

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
