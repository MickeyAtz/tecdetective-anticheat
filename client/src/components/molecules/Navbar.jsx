import React from 'react';
import NavItem from '@/components/atoms/NavItem.jsx';
import NavDropDown from '@/components/atoms/NavDropDown.jsx';
import Button from '@/components/atoms/Button.jsx';
import { useUser } from '@/context/UserContext.jsx';

import { navBarItems } from '@/config/navBarItems.js';

const Navbar = ({ isDarkMode, toggleDarkMode }) => {
    const navStyle = `fixed top-0 left-0 w-full h-16 bg-bg-secondary border-b border-border-primary/60 shadow-sm flex items-center justify-between px-8 z-50`;
    const brandStyle = `text-xl font-bold text-brand-primary`;
    const themeButtonStyle =
        'rounded-lg border border-border-primary bg-bg-primary px-3 py-1.5 text-sm font-medium text-text-primary transition-all hover:border-brand-primary/50 hover:text-brand-primary shadow-sm';
    const navLinkStyle = 'flex items-center gap-1.5 list-none m-0 p-0';

    const { setUser, setToken } = useUser();
    const handleLogOut = () => {
        setToken(null);
        setUser(null);
    };

    // TODO Agregar logica de navegacion, definir los elementos que llevara y agregarlos
    return (
        <nav className={navStyle}>
            <span className={brandStyle}>TEC Detective</span>

            <div className="flex items-center gap-4">
                <ul className={navLinkStyle}>
                    {navBarItems.map((item) => {
                        if (item.isDropdown) {
                            return (
                                <NavDropDown
                                    key={item.id}
                                    label={item.label}
                                    items={item.subItems}
                                />
                            );
                        }
                        return (
                            <NavItem key={item.id} path={item.path}>
                                {item.label}
                            </NavItem>
                        );
                    })}
                </ul>
            </div>
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    className={themeButtonStyle}
                    onClick={toggleDarkMode}
                    aria-label="Cambiar tema"
                >
                    {isDarkMode ? '☀️' : '🌙'}
                </button>
                <Button variant="secondary" title="Cierre se sesión" onClick={handleLogOut}>
                    Cerrar Sesión
                </Button>
            </div>
        </nav>
    );
};

export default Navbar;
