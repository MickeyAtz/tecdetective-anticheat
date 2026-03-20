import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';

const NavDropDown = ({ label, items }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Se cierra el menu si se ahce click fuera del componente
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Definicion de estilos
    const baseStyle = `flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer`;
    const inactiveStyle = `text-text-secondary hover:bg-bg-tertiary hover:text-text-primary`;
    const activeStyle = `bg-brand-primary/10 text-brand-primary`;

    return (
        <li className="list-none relative" ref={dropdownRef}>
            {/*BOTON DISPARADOR*/}
            <button
                className={`${baseStyle} ${isOpen ? activeStyle : inactiveStyle}`}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
                <span>{label}</span>
            </button>

            {/**Menu desplegable */}
            {isOpen && (
                <ul className="absolute top-full left-0 mt-2 w-32 bg-bg-secondary border border-border-primary/60 rounded-xl shadow-lg py-2 z-50 overflow-hidden">
                    {items.map((item, index) => (
                        <li key={index}>
                            <NavLink
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `block px-4 py-2 text-sm transition-colors ${
                                        isActive
                                            ? 'text-brand-primary bg-brand-primary/10'
                                            : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
};

export default NavDropDown;
