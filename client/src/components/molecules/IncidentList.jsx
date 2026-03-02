import React from 'react';

//Importación de componentes
import IncidentListItem from '@/components/atoms/IncidentListItem.jsx';

const IncidentList = ({ incidents }) => {
    const styleList = `mt-2 mx-2 mb-3 p-3 bg-bg-tertiary/40 rounded-lg border border-border-primary/50`;

    return (
        <ul className={styleList}>
            {incidents.map((incident) => (
                <IncidentListItem key={incident.id} incident={incident}></IncidentListItem>
            ))}
        </ul>
    );
};

export default IncidentList;
