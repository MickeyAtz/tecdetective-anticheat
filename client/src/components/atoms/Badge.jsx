import React from 'react';

const Badge = ({ children, variant = 'primary' }) => {
    const baseStyles =
        'px-2 py-0.5 text-[10px] font-black rounded-sm inline-flex items-center justify-center leading-tight uppercase tracking-widest border border-transparent';

    const variantStyles = {
        primary: 'bg-brand-primary text-white',
        success: 'bg-status-success text-white',
        danger: 'bg-status-danger text-white',
        warning: 'bg-status-warning text-white',
        info: 'bg-bg-tertiary text-text-secondary border-border-primary',
    };

    return (
        <span className={`${baseStyles} ${variantStyles[variant]}`}>
            {children}
        </span>
    );
};

export default Badge;
