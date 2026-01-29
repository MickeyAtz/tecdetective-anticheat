import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente Select para la interfaz
 * * @param {Object} props - Propiedades del componente
 * @param {Array<string>} props.options - Opciones del select
 * @param {string} props.label - label del select
 * @param {string} [props.variant='primary'] - Variante del estilo del Select
 * @param {string|number} props.value - valor del select
 * @param {function} props.onChange - Funcion onChange del select
 * @param {string} props.name - Nombre del select y label
 * @param {string} props.placeholder - Placeholder del select
 * @return {JSX.Element} - Retorna el componente Select para la interfaz
 */

const Select = ({
    options = [],
    label,
    variant = 'primary',
    value,
    onChange,
    name,
    placeholder,
}) => {
    // TODO Definicion de estilos base
    const baseStyles = '';
    // TODO Definicion de las variantes
    const variantStyles = {
        primary: '',
        secondary: '',
    };
    // TODO Definicion de estilos del label
    const labelStyle = '';

    return (
        <>
            {label && (
                <label htmlFor={name} className={labelStyle}>
                    {label}
                </label>
            )}
            <select
                name={name}
                className={`${baseStyles} ${variantStyles[variant]}`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </>
    );
};

// Definicion de los Props del Componente
Select.propTypes = {
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    label: PropTypes.string.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary']),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
};

export default Select;
