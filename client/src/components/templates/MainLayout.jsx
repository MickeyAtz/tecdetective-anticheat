import React from 'react';
import { Outlet } from 'react-router-dom';
//Importacion de componentes (navbar)
import Navbar from '@/components/molecules/Navbar';

const MainLayout = ({ children }) => {
    const layoutStyle = `min-h-screen bg-bg-primary text-text-primary transition-colors duration-300`;
    const containerStyle = `max-w-4xl mx-auto p-4 pt-20`;

    return (
        <div className={layoutStyle}>
            <Navbar />
            <main className={containerStyle}>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
