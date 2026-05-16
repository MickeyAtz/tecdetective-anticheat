import React from 'react';

const StatsCard = ({ title, value, color = 'text-brand-primary' }) => {
    return (
        <div className="bg-bg-secondary border border-border-primary rounded-3xl p-6 shadow-sm">
            <p className="text-sm text-text-secondary font-medium mb-3">{title}</p>

            <h3 className={`text-4xl font-bold ${color}`}>{value}</h3>
        </div>
    );
};

export default StatsCard;
