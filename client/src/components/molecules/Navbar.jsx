import React from 'react';

const Navbar = () => {
    const navStyle = `fixed top-0 left-0 w-full h-16 bg-bg-secondary border-b border-border-primary flex items-center justify-between px-8 z-50`;
    const brandStyle = `text-xl font-bold text-brand-primary`;

    // TODO Agregar logica de navegacion, definir los elementos que llevara y agregarlos
    return (
        <nav className={navStyle}>
            <span className={brandStyle}></span>
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-bg-tertiary"></div>
            </div>
        </nav>
    );
};

export default Navbar;
