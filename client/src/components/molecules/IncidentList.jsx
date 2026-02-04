import React from 'react';

//Importación de componentes
import IncidentListItem from '@/components/atoms/IncidentListItem';

const IncidentList = ({ incidents }) => {
    const styleList = `mt-4 ml-4 p-4 bg-bg-tertiary rounded-lg border-l-4 border-status-warning`;

    return (
        <ul className={styleList}>
            {incidents.map((incident) => (
                <IncidentListItem
                    key={incident.id}
                    incident={incident}
                ></IncidentListItem>
            ))}
        </ul>
    );
};

export default IncidentList;
