import React, { useState } from 'react';

const Select = ({
    options = [],
    label,
    variant = 'primary',
    value,
    onChange,
    name,
    placeholder,
    disabled = false,
}) => {
    const baseStyles = `
        w-full px-4 py-2.5 
        rounded-lg border-2 
        bg-bg-tertiary text-text-primary 
        outline-none transition-all duration-200 
        focus:border-brand-primary focus:bg-bg-primary 
        focus:ring-4 focus:ring-brand-primary/10 
        cursor-pointer disabled:opacity-50
    `;
    const variantStyles = {
        primary: 'border-transparent',
        secondary: 'border-border-primary bg-bg-secondary',
    };
    const labelStyle = 'block text-sm font-semibold text-text-secondary mb-1.5 ml-0.5';

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
                disabled={disabled}
            >
                {placeholder && (
                    <option value="" disabled className="bg-bg-secondary text-text-tertiary">
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                        className="bg-bg-secondary text-text-primary py-2"
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Select;
