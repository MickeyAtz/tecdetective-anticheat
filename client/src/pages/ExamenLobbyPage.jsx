import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '@/context/SocketContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

import { cambiarEstadoExamen, getExamenById } from '@/api/examenes.api.js';

import Button from '@/components/atoms/Button.jsx';
import StudentList from '@/components/molecules/StudentList.jsx';
import ExamenHeader from '@/components/organism/ExamenHeader.jsx';
import ExamenSection from '@/components/organism/ExamenSection.jsx';
import StatsCard from '@/components/atoms/StatsCards.jsx';
import EmptyState from '@/components/atoms/EmptyState.jsx';

const ExamenLobbyPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const socket = useSocket();

    const [participantes, setParticipantes] = useState([]);
    const [examen, setExamen] = useState(null);

    useEffect(() => {
        if (!socket) return;

        if (!socket.connected) {
            socket.connect();
        }

        const handleConnect = () => {
            socket.emit('unirse_examen', {
                usuario: null,
                examen: { idExamen: id },
                rol: 'profesor',
            });

            socket.emit('solicitar_conectados', id, (participantesConectados) => {
                setParticipantes(participantesConectados);
            });
        };

        const handleNuevoParticipante = (usuario) => {
            setParticipantes((prev) => {
                if (prev.some((p) => p.nControl === usuario.nControl)) return prev;
                return [...prev, usuario];
            });
        };

        const handleDesconexion = (data) => {
            setParticipantes((prev) => prev.filter((p) => p.nControl !== data.nControl));
        };

        if (socket.connected) {
            handleConnect();
        }

        socket.on('connect', handleConnect);
        socket.on('nuevo_participante', handleNuevoParticipante);
        socket.on('participante_desconectado', handleDesconexion);

        return () => {
            socket.off('connect', handleConnect);
            socket.off('nuevo_participante', handleNuevoParticipante);
            socket.off('participante_desconecatdo', handleDesconexion);
        };
    }, [socket, id]);

    useEffect(() => {
        const fetchExamen = async () => {
            try {
                const result = await getExamenById(id);
                setExamen(result);
            } catch (err) {
                console.error(err);
            }
        };

        fetchExamen();
    }, [id]);

    const handleIniciarExamen = async () => {
        if (socket) {
            const configInicio = {
                idExamen: id,
                horaInicioReal: new Date().toISOString(),
            };

            socket.emit('iniciar_examen_profesor', configInicio);

            await cambiarEstadoExamen(id, 'ESPERA');
            toast.success('Examen comenzado...');

            navigate(`/examen/monitor/${id}`);
        }
    };

    const handleCancelarLobby = async () => {
        const confirmar = window.confirm('Estas seguro de cancelar el lobby?');

        if (!confirmar) return;

        try {
            await cambiarEstadoExamen(id, 'PENDIENTE');

            if (socket) {
                socket.emit('profesor_cancela_lobby', { idExamen: id });
            }
            toast.success('Examen cancelado');

            navigate('/dashboard');
        } catch (error) {
            console.error('Error al cancelar el lobby: ', error);
        }
    };

    if (!examen) return null;
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto p-6 flex flex-col gap-6"
        >
            <ExamenHeader
                type="lobby"
                examen={examen}
                primaryAction={
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={handleIniciarExamen}
                        disabled={participantes.length === 0}
                    >
                        Iniciar examen
                    </Button>
                }
                secondaryAction={
                    <Button variant="danger" size="lg" onClick={handleCancelarLobby}>
                        Cancelar
                    </Button>
                }
            />

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatsCard title="Participantes conectados" value={participantes.length} />

                <StatsCard title="Estado" value="Esperando" color="text-blue-600" />
            </section>

            <ExamenSection title="Participantes conectados">
                {participantes.length > 0 ? (
                    <StudentList students={participantes} onlyData={true} />
                ) : (
                    <EmptyState message="Esperando conexiones desde la extensión..." />
                )}
            </ExamenSection>
        </motion.div>
    );
};

export default ExamenLobbyPage;
