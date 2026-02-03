import React from 'react';

const Input = ({
    label, //label del input
    type = 'text', // tipo de input
    placeholder = '', // placeholder
    value, //value
    onChange, // funcion on change
    name, //Nombre dle input
    variant = 'primary', //Variante del input
    className, //clase del input
    autoComplete, // Propiedad autoComplete del input
    ...props // Reesto de propiedades del input
}) => {
    // Estilos para el texto de la etiqueta
    const labelStyle =
        'block text-sm font-semibold text-text-secondary mb-1.5 ml-0.5';

    // Estilos para el campo de entrada
    const baseStyle = `
        w-full px-4 py-2.5 
        rounded-lg border-2 border-transparent 
        bg-bg-tertiary text-text-primary 
        placeholder:text-text-tertiary 
        outline-none transition-all duration-200 
        focus:border-brand-primary focus:bg-bg-primary 
        focus:ring-4 focus:ring-brand-primary/10
        disabled:opacity-50 disabled:cursor-not-allowed
    `;

    return (
        <div className="w-full mb-4">
            {label && (
                <label htmlFor={name} className={labelStyle}>
                    {label}
                </label>
            )}
            <input id={name} name={name} className={baseStyle} {...props} />
        </div>
    );
};

export default Input;
