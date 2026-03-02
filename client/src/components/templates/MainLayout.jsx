import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
//Importacion de componentes (navbar)
import Navbar from '@/components/molecules/Navbar';

const MainLayout = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme) {
            return savedTheme === 'dark';
        }

        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle('dark', isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode((currentTheme) => !currentTheme);

    const layoutStyle = `min-h-screen bg-bg-primary text-text-primary transition-colors duration-300`;
    const containerStyle = `max-w-5xl mx-auto p-4 pt-20`;

    return (
        <div className={layoutStyle}>
            <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            <main className={containerStyle}>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
