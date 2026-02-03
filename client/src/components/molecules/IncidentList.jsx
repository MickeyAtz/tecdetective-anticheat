import React from 'react';
import IncidentListItem from '@/components/atoms/IndicentListItem';

const IncidentList = ({ incidents }) => {
    const styleList = ``;

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
