import React, { useState } from 'react';

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
    const baseStyles = `
        w-full px-4 py-2.5 
        rounded-lg border-2 
        bg-bg-tertiary text-text-primary 
        outline-none transition-all duration-200 
        focus:border-brand-primary focus:bg-bg-primary 
        focus:ring-4 focus:ring-brand-primary/10 
        cursor-pointer disabled:opacity-50
    `;
    // TODO Definicion de las variantes
    const variantStyles = {
        primary: 'border-transparent',
        secondary: 'border-border-primary bg-bg-secondary',
    };
    // TODO Definicion de estilos del label
    const labelStyle =
        'block text-sm font-semibold text-text-secondary mb-1.5 ml-0.5';

    return (
        <div className="w-full mb-4">
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
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-tertiary">
                <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>
        </div>
    );
};

export default Select;
