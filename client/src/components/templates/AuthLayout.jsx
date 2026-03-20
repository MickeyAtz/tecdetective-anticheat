import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Card from '@/components/molecules/Card';

const AuthLayout = () => {
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
    const wrapperStyle = `min-h-screen bg-bg-tertiary flex items-center justify-center p-4 transition-colors duration-300`;
    const innerContainerStyle = `w-full max-w-md`;
    const themeButtonStyle =
        'absolute top-5 right-10 rounded-lg border border-border-primary bg-bg-primary px-3 py-1.5 text-sm font-medium text-text-primary transition-all hover:border-brand-primary/50 hover:text-brand-primary shadow-sm';

    return (
        <>
            <div className={wrapperStyle}>
                <button
                    type="button"
                    className={themeButtonStyle}
                    onClick={toggleDarkMode}
                    aria-label="Cambiar tema"
                >
                    {isDarkMode ? '☀️' : '🌙'}
                </button>
                <div className={innerContainerStyle}>
                    <Card
                        title="Tec Detective"
                        subtitle="Panel de Monitoreo"
                        footer={
                            <p className="text-xs text-text-tertiary">
                                © 2026 ITSJ - Todos los derechos reservados.
                            </p>
                        }
                    >
                        <Outlet />
                    </Card>
                </div>
            </div>
        </>
    );
};

export default AuthLayout;
