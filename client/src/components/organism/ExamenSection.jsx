import React from 'react';

const ExamenSection = ({ title, children }) => {
    return (
        <section className="bg-bg-secondary border border-border-primary rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-text-primary mb-6">{title}</h2>

            {children}
        </section>
    );
};

export default ExamenSection;
