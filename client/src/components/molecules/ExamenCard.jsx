import React from 'react';

import Button from '@/components/atoms/Button.jsx';

import {
    CalendarDays,
    Users,
    BookOpen,
    KeyRound,
    Timer,
    Edit2,
    Trash2,
    Eye,
    BarChart3,
    DoorOpen,
} from 'lucide-react';

// Configuración de status
const statusConfig = {
    PENDIENTE: {
        label: 'Agendado',
        icon: CalendarDays,
        color: 'var(--color-text-tertiary)',
    },
    ESPERA: {
        label: 'En Lobby',
        icon: DoorOpen,
        color: 'var(--color-status-warning)',
    },
    ACTIVO: {
        label: 'En Curso',
        icon: Timer,
        color: 'var(--color-status-success)',
    },
    FINALIZADO: {
        label: 'Finalizado',
        icon: BarChart3,
        color: 'var(--color-text-tertiary)',
    },
};

const ExamenCard = ({ examen, onEdit, onDelete, onStatusChange, onViewMonitor, onViewResults }) => {
    const {
        id,
        titulo,
        materia_nombre,
        grupo_nombre,
        codigo_acceso,
        duracion_minutos,
        estado,
        programed_at,
    } = examen;

    const config = statusConfig[estado] || statusConfig.PENDIENTE;
    const StatusIcon = config.icon;

    const fechaFormateada = new Date(programed_at).toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="flex flex-col rounded-2xl p-5 shadow-sm hover:shadow-md transition bg-bg-secondary border border-border-primary">
            {/* HEADER */}
            <div className="flex items-start justify-between gap-3 mb-3">
                {/* TITULO */}
                <h3 className="text-lg font-bold leading-tight text-text-primary line-clamp-2">
                    {titulo}
                </h3>

                {/* STATUS */}
                <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold shrink-0"
                    style={{
                        color: config.color,
                        borderColor: config.color,
                        backgroundColor: `${config.color}15`,
                    }}
                >
                    <StatusIcon size={14} />
                    {config.label}
                </div>
            </div>

            {/* SUBINFO */}
            <div className="mb-4 space-y-1">
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <BookOpen size={16} />
                    {materia_nombre || 'Materia no definida'}
                </div>

                <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <span className="flex items-center gap-1">
                        <Users size={15} /> {grupo_nombre || 'N/A'}
                    </span>

                    <span className="flex items-center gap-1">
                        <Timer size={15} /> {duracion_minutos} min
                    </span>
                </div>
            </div>

            {/* CODIGO (PROTAGONISTA) */}
            <div className="flex flex-col items-center justify-center bg-bg-tertiary border border-border-primary rounded-xl py-4 mb-4">
                <span className="text-xs uppercase tracking-wider text-text-tertiary mb-1 flex items-center gap-1">
                    <KeyRound size={14} /> Código de acceso
                </span>

                <span className="font-mono text-2xl font-extrabold tracking-widest text-text-primary">
                    {codigo_acceso}
                </span>
            </div>

            {/* FECHA */}
            <div className="text-xs text-text-tertiary mb-4 flex items-center gap-1">
                <CalendarDays size={14} />
                {fechaFormateada}
            </div>

            {/* FOOTER ACTIONS */}
            <div className="mt-auto flex flex-col gap-2">
                {estado === 'PENDIENTE' && (
                    <div className="flex gap-2">
                        <Button
                            onClick={onEdit}
                            className="flex-1 text-sm py-2"
                            variant="secondary"
                        >
                            Editar
                        </Button>

                        <Button onClick={onDelete} className="flex-1 text-sm py-2" variant="danger">
                            Eliminar
                        </Button>
                    </div>
                )}

                {estado === 'PENDIENTE' && (
                    <button
                        onClick={() => onStatusChange(id, 'ESPERA')}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand-primary text-white font-semibold hover:bg-brand-secondary transition"
                    >
                        <DoorOpen size={16} /> Abrir Lobby
                    </button>
                )}

                {(estado === 'ESPERA' || estado === 'ACTIVO') && (
                    <button
                        onClick={() => onViewMonitor(id)}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold bg-status-success"
                    >
                        <Eye size={18} /> Ver Monitoreo En Vivo
                    </button>
                )}

                {estado === 'FINALIZADO' && (
                    <button
                        onClick={() => onViewResults(id)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border-primary text-text-primary font-semibold hover:bg-bg-tertiary transition"
                    >
                        <BarChart3 size={18} /> Ver Resultados
                    </button>
                )}
            </div>
        </div>
    );
};

export default ExamenCard;
