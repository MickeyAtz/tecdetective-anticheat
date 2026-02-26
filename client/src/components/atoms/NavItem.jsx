import React from 'react';
import { NavLink } from 'react-router-dom';

const NavItem = ({ path, children }) => {
    const baseStyle = `flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200`;
    const inactiveStyle = `text-text-secondary hover:bg-bg-tertiary hover:text-text-primary`;
    const activeStyle = `bg-brand-primary/10 text-brand-primary`;
    return (
        <li className="list-none">
            <NavLink
                to={path}
                className={({ isActive }) =>
                    `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
                }
            >
                <span>{children}</span>
            </NavLink>
        </li>
    );
};

export default NavItem;
