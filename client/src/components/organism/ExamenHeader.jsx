import React from 'react';
import Button from '@/components/atoms/Button.jsx';

const statusConfig = {
    lobby: {
        badge: 'EN PREPARACIÓN',
        badgeClass: 'bg-blue-100 text-blue-700',
        title: 'Sala de espera',
        description: 'Esperando que los alumnos se conecten al examen.',
    },

    monitor: {
        badge: 'EXAMEN EN CURSO',
        badgeClass: 'bg-green-100 text-green-700',
        title: 'Monitoreo en tiempo real',
        description: 'Supervisión activa de participantes e incidentes.',
    },

    historial: {
        badge: 'FINALIZADO',
        badgeClass: 'bg-zinc-200 text-zinc-700',
        title: 'Historial del examen',
        description: 'Consulta el resumen final del examen.',
    },
};

const ExamenHeader = ({ type = 'lobby', examen, primaryAction, secondaryAction }) => {
    const config = statusConfig[type];

    return (
        <header className="rounded-3xl border border-border-primary bg-bg-secondary p-8 shadow-sm">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
                <div className="space-y-4">
                    <span
                        className={`inline-flex px-4 py-1 rounded-full text-sm font-semibold ${config.badgeClass}`}
                    >
                        {config.badge}
                    </span>

                    <div>
                        <h1 className="text-4xl font-bold text-text-primary mb-2">
                            {config.title}
                        </h1>

                        <p className="text-lg text-text-secondary max-w-2xl">
                            {config.description}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-6 text-sm text-text-secondary pt-2">
                        <span>
                            <strong>Examen:</strong> {examen?.titulo}
                        </span>

                        <span>
                            <strong>Duración:</strong> {examen?.duracion_minutos} min
                        </span>

                        {examen?.grupo_nombre && (
                            <span>
                                <strong>Grupo:</strong> {examen.grupo_nombre}
                            </span>
                        )}

                        {examen?.materia_nombre && (
                            <span>
                                <strong>Materia:</strong> {examen.materia_nombre}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    {secondaryAction}

                    {primaryAction}
                </div>
            </div>
        </header>
    );
};

export default ExamenHeader;
