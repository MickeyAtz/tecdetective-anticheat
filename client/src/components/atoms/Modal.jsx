import React, { useEffect, useState } from 'react';

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
    const overlayStyles = `
        fixed inset-0 z-50 flex items-center justify-center p-4 
        bg-black/40 backdrop-blur-xs transition-opacity duration-300
        ${isOpen ? 'opacity-100' : 'opacity-0'}
    `;

    const baseStyles = `
        relative w-full max-w-md p-6 rounded-xl shadow-xl 
        bg-bg-primary border border-border-primary
        transform transition-all duration-300
        ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
    `;

    const closeBtnStyle = `
        absolute top-3 right-3 w-8 h-8 flex items-center justify-center
        rounded-lg text-text-tertiary hover:bg-bg-tertiary hover:text-text-primary
        transition-colors cursor-pointer
    `;

    return (
        <div className={`${overlayStyles}`} onClick={onClose}>
            <div
                className={`${baseStyles}`}
                onClick={(e) => e.stopPropagation()}
            >
                {title && (
                    <h2 className="text-xl font-bold text-text-primary mb-4">
                        {title}
                    </h2>
                )}
                {children}
                <button className={`${closeBtnStyle}`} onClick={onClose}>
                    X
                </button>
            </div>
        </div>
    );
};

export default Modal;
