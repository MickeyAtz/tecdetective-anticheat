import React from 'react';

const Navbar = ({ isDarkMode, toggleDarkMode }) => {
    const navStyle = `fixed top-0 left-0 w-full h-16 bg-bg-secondary border-b border-border-primary flex items-center justify-between px-8 z-50`;
    const brandStyle = `text-xl font-bold text-brand-primary`;
    const themeButtonStyle =
        'rounded-lg border border-border-primary bg-bg-tertiary px-3 py-1.5 text-sm font-medium text-text-primary transition-colors hover:bg-bg-primary';

    // TODO Agregar logica de navegacion, definir los elementos que llevara y agregarlos
    return (
        <nav className={navStyle}>
            <span className={brandStyle}>TEC Detective</span>
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    className={themeButtonStyle}
                    onClick={toggleDarkMode}
                    aria-label="Cambiar tema"
                >
                    {isDarkMode ? '☀️ Claro' : '🌙 Oscuro'}
                </button>
                <div className="w-8 h-8 rounded-full bg-bg-tertiary"></div>
            </div>
        </nav>
    );
};

export default Navbar;
