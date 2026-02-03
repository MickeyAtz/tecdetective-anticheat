import React from 'react';

const Button = ({
    children,
    icon,
    variant = 'primary',
    size = 'md',
    onClick,
    disabled = false,
    title = '',
}) => {
    //Definicion y creacion del componente IconComponent si se manda icon
    const IconComponent = icon ? iconMap[icon] : null;
    const hasOnlyIcon = icon && !children;

    // Definicion del estilo base del boton
    // Completar estilos de Boton
    const baseStyles =
        'font-semibold rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:opacity-50 disabled:cursor-not-allowed';
    // Definicion de variantes
    // Completar las variantes del boton
    const variantStyles = {
        primary:
            'bg-brand-primary text-white hover:brightness-110 active:scale-95 shadow-sm',
        secondary:
            'bg-brand-secondary text-white hover:brightness-110 active:scale-95 shadow-sm',
        ghost: 'bg-transparent text-text-primary hover:bg-bg-tertiary',
    };
    // Definicion de tamaños
    //  Completar los tamaños del botón
    const variantSizes = {
        sm: 'text-xs px-3 py-1.5', // Para micro-interacciones
        md: 'text-sm px-4 py-2', // El estándar para la mayoría de las UIs
        lg: 'text-base px-6 py-3', // Para CTAs principales
    };
    //  Definir estilos del botón cuando tenga ícono
    const iconStyle = 'aspect-square !p-2';

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${variantSizes[size]} ${hasOnlyIcon ? iconStyle : ''}`}
            onClick={onClick}
            title={title || (hasOnlyIcon ? children : '')}
            disabled={disabled && 'disabled'}
        >
            {IconComponent && <IconComponent />}
            {children}
        </button>
    );
};

export default Button;
