import React from 'react';

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


export default Input;
