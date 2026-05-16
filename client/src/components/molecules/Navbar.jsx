import React from 'react';
import NavItem from '@/components/atoms/NavItem.jsx';
import NavDropDown from '@/components/atoms/NavDropDown.jsx';
import Button from '@/components/atoms/Button.jsx';
import { useUser } from '@/context/UserContext.jsx';

import logo from '@/img/icon.png';

import { navBarItems } from '@/config/navBarItems.js';
import TopbarDropdown from '@/components/organism/TopbarDropdown';

const Navbar = ({ isDarkMode, toggleDarkMode, openModal, openModalPassword }) => {
    const navStyle = `fixed top-0 left-0 w-full h-16 bg-bg-secondary border-b border-border-primary/60 shadow-sm flex items-center justify-between gap-6 px-8 z-50`;
    const navLinkStyle = 'flex items-center gap-1.5 list-none m-0 p-0';

    const { user, setUser, setToken } = useUser();
    const handleLogOut = () => {
        setToken(null);
        setUser(null);
    };

    return (
        <nav className={navStyle}>
            <div className="flex items-center gap-3 shrink-0">
                {/* LOGO */}
                <img
                    src={logo}
                    alt="Tec Detective"
                    className={`w-15 h-15 object-contain ${isDarkMode ? 'invert' : ''}`}
                />

                {/* BRANDING */}
                <div className="flex flex-col leading-tight">
                    <span className="text-lg font-bold text-text-primary">TEC Detective</span>

                    <span className="text-xs text-text-secondary">Sistema de monitoreo</span>
                </div>
            </div>

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
                <TopbarDropdown
                    user={user}
                    onLogout={handleLogOut}
                    toggleTheme={toggleDarkMode}
                    isDarkMode={isDarkMode}
                    openModal={openModal}
                    openModalPassword={openModalPassword}
                ></TopbarDropdown>
            </div>
        </nav>
    );
};

export default Navbar;
