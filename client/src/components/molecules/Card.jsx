import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ title, subtitle, children, footer }) => {
    // TODO Definicion de estilos
    const styleCard = '';
    const styleTitle = '';
    const styleSubtitle = '';
    const styleBody = '';
    const styleFooter = '';

    return (
        <div className={styleCard}>
            {title && <h3 className={styleTitle}></h3>}
            {subtitle && <h4 className={styleSubtitle}></h4>}
            <div className={styleBody}>{children}</div>
            {footer && <div className={styleFooter}>{footer}</div>}
        </div>
    );
};



export default Card;
