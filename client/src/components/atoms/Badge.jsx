import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente Badge para mostrar anotaciones o etiquetas destacadas
 * * @param {Object} props - Propiedades del componente
 * @param {string} props.children - Texto del badge
 * @param {string} props.variant - Variante del componente (estilo)
 * @returns {JSX.Element} Retorna el componente Badge para anotaciones y enfasis en distintas situaciones
 */

const Badge = ({ children, variant = 'primary' }) => {
    //Creación de estilos con tailwindcss
    const baseStyles =
        'inline-flex items-start px-2.5 py-1 rounded-full text-sm';
    //Definición de variantes
    const variantStyles = {
        primary: 'bg-blue-500 text-white',
        secondary: 'bg-gray-500 text-white',
        success: 'bg-green-500 text-white ',
        danger: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-white',
    };

    return (
        <span className={`${baseStyles} ${variantStyles[variant]}`}>
            {children}
        </span>
    );
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
