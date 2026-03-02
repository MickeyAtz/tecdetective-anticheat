import React from 'react';

const VARIANTS = {
    error: {
        container: 'bg-red-50/10 border-red-500 text-red-700',
        iconColor: 'text-red-500',
        iconPath:
            'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z',
    },
    success: {
        container: 'bg-green-50/10 border-green-500 text-green-700',
        iconColor: 'text-green-500',
        iconPath:
            'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
    },
    info: {
        container: 'bg-blue-50/10 border-blue-500 text-blue-700',
        iconColor: 'text-blue-500',
        iconPath:
            'M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z',
    },
};

const Alerta = ({ children, type = 'error' }) => {
    const variant = VARIANTS[type] || VARIANTS.error;

    return (
        <div
            className={`${variant.container} border-2 rounded-2xl p-4 mb-6 flex items-center animate-in fade-in duration-300 shadow-sm`}
        >
            <div className="shrink-0">
                {/* Icono de advertencia */}
                <svg
                    className={`${variant.iconColor} h-5 w-5`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path fillRule="evenodd" d={`${variant.iconPath}`} clipRule="evenodd" />
                </svg>
            </div>
            <div className="ml-3">
                <p className="text-sm font-medium">{children}</p>
            </div>
        </div>
    );
};

export default Alerta;
