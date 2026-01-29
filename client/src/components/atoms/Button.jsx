import React from 'react';

/**
 * Componente Boton versátil para la interfaz principal.
 * * @param {Object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Contenido del texto o boton
 * @param {string|null} [props.icon=null] - Icono del boton (Si es que lleva, puede ser null)
 * @param {'primary' | 'secondary' | 'success' | 'danger' | 'warning'} [props.variant='primary'] - Variante del estilo del boton
 * @param {'sm' | 'md' | 'lg'} [props.size=md] - Tamaño del botón
 * @param {function} props.onClick - Funcion onClick que sera ejecutada cuando se haga click
 * @param {boolean} [props.disabled=false] - Booleano para deeshabilitar el boton
 * @return {JSX.Element} - Retorna el componente Boton para la interfaz
 */

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
    // TODO Completar estilos de Boton
    const baseStyles = 'px-4 py-2 font-semibold rounded ';
    // Definicion de variantes
    // TODO Completar las variantes del boton
    const variantStyles = {};
    // Definicion de tamaños
    // TODO Completar los tamaños del botón
    const variantSizes = {};
    // Definición de estilo del botón con ícono
    // TODO Definir estilos del botón cuando tenga ícono
    const iconStyle = '';

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
