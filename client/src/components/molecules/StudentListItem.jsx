import React, { useState } from 'react';

// Importación de Componentes
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import IncidentList from '@/components/molecules/IncidentList';

const ListItem = ({ student }) => {
    // Estado de la barra de incidentes
    const [isOpen, setIsOpen] = useState(false);
    const hasIncidents = student.incidents && student.incidents.length > 0;

    // Contenedores principales
    const styleItem = `mb-4 border border-border-primary rounded-xl overflow-hidden bg-bg-secondary shadow-sm transition-all duration-300`;
    const contenedorStyle = `w-full flex items-center justify-between transition-colors ${hasIncidents ? 'cursor-pointer hover:bg-bg-tertiary' : ''}`;
    // Informacion del alumno (nombre y estado)
    const infoStyle = `flex items-center gap-2 p-2 space-between`;
    const nombreStyle = `font-semibold text-text-primary text-base`;
    // Incidentes
    const incidentesContainer = 'flex items-center gap-2';
    const incidentesInfo = 'text-xs text-text-secondary font-medium';
    const incidentesBtn = `text-xs text-brand-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`;
    // Sin incidentes / Vacio
    const sinIncidentesStyle = 'text-xs text-text-tertiary italic';

    return (
        <li className={`${styleItem}`}>
            <div
                className={contenedorStyle}
                onClick={() => hasIncidents && setIsOpen(!isOpen)}
            >
                {/* Informacion del alumno (Nombre y estado)*/}
                <div className={infoStyle}>
                    <span className={nombreStyle}>{student.nombre}</span>
                    <Badge className={student.status}>{student.status}</Badge>
                </div>

                {/* Seccion de incidentes y su logica*/}
                {hasIncidents ? (
                    <div className={incidentesContainer}>
                        <span className={incidentesInfo}>
                            {student.incidents.length} incidentes
                        </span>
                        <span className={incidentesBtn}>▼</span>
                    </div>
                ) : (
                    <span className={sinIncidentesStyle}>Sin incidentes</span>
                )}
            </div>
            {/* Lista de incidentes del usuario */}
            {isOpen && (
                <IncidentList incidents={student.incidents}></IncidentList>
            )}
        </li>
    );
};

export default ListItem;
