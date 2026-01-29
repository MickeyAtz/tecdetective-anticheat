import React, { useEffect, useState } from 'react';

/**
 * Componente Modal para mostrar contenido en una ventana
 * * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Indica si el modal esta abierto o cerrado
 * @param {function} props.onClose - Funcion encargada de manejar el cierre del modal
 * @param {string} [props.title] - Titulo del modal
 * @param {React.ReactNode} props.children - Contenido del modal
 * @returns {JSX.Element|null} - Retorna el componente Modal o nulll si no esta abierto
 */
const Modal = ({ isOpen, onClose, title, children }) => {
    const [show, setShow] = useState(false);

    // Manejo de la visibilidad del modal
    useEffect(() => {
        if (isOpen) {
            setShow(true);
        } else {
            const timeout = setTimeout(() => setShow(false), 300);
            return () => clearTimeout(timeout);
        }
    }, [isOpen]);

    // Si no esta el show, no se muestra el modal, se retorna solo null
    if (!show) return null;

    // Definicion de estilos
    // TODO Estilo del overlay
    const overlayStyles = '';
    // TODO Estilo base
    const baseStyles = '';
    // TODO Estilo del boton de cierre
    const closeBtnStyle = '';

    return (
        <div className={`${overlayStyles}`} onClick={onClose}>
            <div
                className={`${baseStyles}`}
                onClick={(e) => e.stopPropagation()}
            >
                {title && <h2>{title}</h2>}
                {children}
                <button
                    className={`${closeBtnStyle}`}
                    onClick={onClose}
                ></button>
            </div>
        </div>
    );
};


export default Modal;
