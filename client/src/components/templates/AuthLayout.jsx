import React from 'react';
import { Outlet } from 'react-router-dom';
import Card from '@/components/molecules/Card';

const AuthLayout = () => {
    const wrapperStyle = `min-h-screen bg-bg-tertiary flex items-center justify-center p-4 transition-colors duration-300`;
    const innerContainerStyle = `w-full max-w-md`;

    return (
        <div className={wrapperStyle}>
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
    );
};

export default AuthLayout;
