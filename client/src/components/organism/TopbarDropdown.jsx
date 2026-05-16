import React, { useState, useEffect, useRef } from 'react';


const TopbarDropdown = ({
    user,
    onLogout,
    toggleTheme,
    isDarkMode,
    openModal,
    openModalPassword,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // UseEffect para controlar los clics fuera del componente
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    });

    console.log(user);

    return (
        <div className="relative flex items-center" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-primary text-white font-bold transition-transform duration-200 hover:scale-105 shadow-sm"
                type="button"
            >
                {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
            </button>
            {/* Menu desplegable */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-bg-secondary border border-border-primary/60 rounded-xl shadow-lg py-2 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-border-primary/60">
                        <p className="text-xs text-text-secondary truncate mt-0.5">
                            {user?.nombre || 'Usuario'}
                        </p>
                        <p className="text-xs text-text-secondary truncate mt-0.5">
                            {user?.email || 'correo@ejemplo.com'}
                        </p>
                    </div>
                    <div className="py-1">
                        <button
                            onClick={openModal}
                            className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-colors duration-200"
                        >
                            Mi Perfil
                        </button>

                        <button
                            onClick={openModalPassword}
                            className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-colors duration-200"
                        >
                            Cambiar contraseña
                        </button>

                        <button
                            onClick={toggleTheme}
                            className="w-full flex justify-between items-center px-4 py-2 text-sm text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-colors duration-200"
                        >
                            <span>Tema Oscuro</span>
                            <span>{isDarkMode ? '🌙' : '☀️'}</span>
                        </button>

                        <div className="border-t border-border-primary/60 py-1 mt-1">
                            <button
                                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-colors duration-200"
                                onClick={onLogout}
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TopbarDropdown;
