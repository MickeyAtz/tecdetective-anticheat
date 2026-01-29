import React from 'react';
import PropTypes from 'prop-types';

/**
 * Creación del componente Input para la interfaz
 * * @param {Object} props - Propiedades del componente
 * @param {string} props.label - Label del input
 * @param {string} [props.type='text'] - Tipo de input
 * @param {string} [props.placeholder=''] - Placeholder del input
 * @param {string|number} props.value - valor del input
 * @param {function} props.onChange - Funcion onChange del input
 * @param {string} props.name - Nombre del input
 * @param {'primary'|'secondary'} [props.variant='primary'] - Variante del estilo del input
 * @param {string} props.className - Clase adicional para el input
 * @param {string} props.autoComplete - Atributo autocomplete del input
 * @returns {JSX.Element} - Retorna el componente Input
 */
const Input = ({
    label,
    type = 'text',
    placeholder = '',
    value,
    onChange,
    name,
    variant = 'primary',
    className,
    autoComplete,
    ...props
}) => {
    // TODO Definicion de los estilos base
    const baseStyle = '';
    // TODO Definicion de las variantes
    const variantStyle = {
        primary: '',
        secondary: '',
    };
    // TODO Definicion de los estilos del label
    const labelStyle = '';

    return (
        <div>
            {label && (
                <label
                    htmlFor={name}
                    className={`${labelStyle} ${variantStyle[variant]}`}
                >
                    {label}
                </label>
            )}
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`${baseStyle} ${variantStyle[variant]}`}
                autoComplete={autoComplete}
                required={true}
                {...props}
            />
        </div>
    );
};

//Definicion de los Props del componente
Input.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary']),
    className: PropTypes.string,
    autoComplete: PropTypes.string,
};

export default Input;
