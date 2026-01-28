import React from 'react';
import PropTypes from 'prop-types';

//TODO: Crear estilos y definir el tipo de css que utilizaremos (Modules, Styled Components, etc)
/**
 * Componente Badge para mostrar anotaciones o etiquetas destacadas
 * * @param {Object} props - Propiedades del componente
 * @param {string} props.children - Texto del badge
 * @param {string} props.variant - Variante del componente (estilo)
 * @returns {JSX.Element} Retorna el componente Badge para anotaciones y enfasis en distintas situaciones
 */

const Badge = ({ children, variant = 'primary' }) => {
    //Creación de estilos con tailwindcss
    //TODO: Estilos css
    //Definición de variantes
    //TODO: Estilos según la variante
    return <span className={``}>{children}</span>;
};

// Validación de Props mediante PropTypes
// Definición de las reglas de validación
Badge.propTypes = {
    children: PropTypes.string.isRequired,
    variant: PropTypes.oneOf([
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
    ]),
};

export default Badge;
