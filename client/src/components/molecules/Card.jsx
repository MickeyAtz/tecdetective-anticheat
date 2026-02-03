import React from 'react';

const Card = ({ title, subtitle, children, footer }) => {
    // Definicion de estilos
    const styleCard =
        'bg-bg-secondary border border-border-primary rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300';
    const styleTitle = 'text-lg font-bold text-text-primary px-6 pt-6';
    const styleSubtitle = 'text-sm text-text-secondary px-6 pb-2';
    const styleBody = 'px-6 py-4 text-text-secondary leading-relaxed';
    const styleFooter =
        'px-6 py-4 bg-bg-tertiary/50 border-t border-border-primary flex items-center justify-end gap-3';

    return (
        <div className={styleCard}>
            {title && <h3 className={styleTitle}>{title}</h3>}
            {subtitle && <h4 className={styleSubtitle}>{subtitle}</h4>}
            <div className={styleBody}>{children}</div>
            {footer && <div className={styleFooter}>{footer}</div>}
        </div>
    );
};

export default Card;
