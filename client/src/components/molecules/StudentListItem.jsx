import React, { useState } from 'react';

// Importación de Componentes
import Badge from '@/components/atoms/Badge';
import IncidentList from '@/components/molecules/IncidentList';

const ListItem = ({ student }) => {
    // Estado de la barra de incidentes
    const [isOpen, setIsOpen] = useState(false);

    const listaIncidentes = student.incidentes || student.incidentes || [];
    const hasIncidents = listaIncidentes.length > 0;

    return (
        <li className="mb-4 border border-border-primary rounded-2xl overflow-hidden bg-bg-secondary shadow-sm transition-all duration-300 list-none">
            <div
                className={`w-full px-6 py-4 flex items-center justify-between transition-colors ${hasIncidents ? 'cursor-pointer hover:bg-bg-tertiary' : ''}`}
                onClick={() => hasIncidents && setIsOpen(!isOpen)}
            >
                {/* Informacion del alumno (Nombre y estado)*/}
                <div className="flex-1 flex justify-start">
                    <span className="font-semibold text-text-primary text-base">
                        {student.nombre}
                    </span>
                </div>

                <div className="flex-1 flex justify-center">
                    <Badge
                        className={
                            listaIncidentes.length === 0
                                ? 'CONFIABLE'
                                : listaIncidentes.length <= 5
                                  ? 'ADVERTENCIA'
                                  : 'CRITICO'
                        }
                    >
                        {listaIncidentes.length === 0
                            ? 'Confiable'
                            : listaIncidentes.length <= 5
                              ? 'Riesgo Medio'
                              : 'Alto Riesgo'}
                    </Badge>
                </div>

                {/* Seccion de incidentes (LISTA INCIDENTES) */}
                <div className="flex-1 flex justify-end items-center gap-3">
                    {hasIncidents ? (
                        <>
                            <span className="text-xs text-text-secondary font-medium">
                                {listaIncidentes.length}{' '}
                                {listaIncidentes.length === 1 ? 'incidente' : 'incidentes'}
                            </span>
                            <span
                                className={`text-xs text-brand-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                            >
                                ▼
                            </span>
                        </>
                    ) : (
                        <span className="text-xs text-text-tertiary italic">Sin incidentes</span>
                    )}
                </div>
            </div>

            {/* Lista de incidentes del usuario */}
            {isOpen && hasIncidents && (
                <div className="border-t border-border-primary">
                    <IncidentList incidents={listaIncidentes} />
                </div>
            )}
        </li>
    );
};

export default ListItem;
