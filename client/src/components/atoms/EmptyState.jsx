import React from 'react';

const EmptyState = ({ message }) => {
    return (
        <div className="border-2 border-dashed border-border-primary rounded-3xl p-16 text-center bg-bg-primary">
            <p className="text-text-secondary text-lg font-medium">{message}</p>
        </div>
    );
};

export default EmptyState;
