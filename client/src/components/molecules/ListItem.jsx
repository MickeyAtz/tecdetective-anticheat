import React from 'react';
import Badge from '@/atoms/Badge';
import Button from '@/atoms/Button';
import IncidentList from '@/molecules/IncidentList';

const ListItem = ({ student }) => {
    // TODO: Implementar los estilos correspondientes
    const styleItem = ``;
    const sinIncidentesStyle = ``;

    //TODO: Creación de IndicentList y IncidentListItem para la lista de incidentes
    return (
        <li className={`${styleItem}`}>
            <span>{student.name}</span>
            <Badge variant={student.status}>{student.status}</Badge>
            {student.incidents.length > 0 ? (
                <IncidentList incidents={student.incidents}></IncidentList>
            ) : (
                <span className={sinIncidentesStyle}>Sin incidentes</span>
            )}
        </li>
    );
};
