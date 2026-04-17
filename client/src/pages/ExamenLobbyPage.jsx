import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '@/context/SocketContext';

import { cambiarEstadoExamen, getExamenById } from '@/api/examenes.api.js';

import Card from '@/components/molecules/Card.jsx';
import Button from '@/components/atoms/Button.jsx';
import StudentList from '@/components/molecules/StudentList.jsx';

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

            navigate('/dashboard');
        } catch (error) {
            console.error('Error al cancelar el lobby: ', error);
        }
    };

    if (!examen) return null;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Card>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="tex-3xl font-bold text-text-primary">
                        Sala de espera del examen: {examen.titulo}
                    </h1>
                    <Button
                        onClick={handleIniciarExamen}
                        disabled={participantes.length === 0}
                        variant="primary"
                    >
                        Comenzar Examen
                    </Button>
                    <Button onClick={handleCancelarLobby} variant="danger">
                        Cancelar Examen
                    </Button>
                </div>
            </Card>

            <div className="space-y-6 py-6">
                <div className="flex items-center gap-4 border-b pb-4">
                    <h2 className="text-xl font-semibold text-text-secondary">
                        Participantes Conectados
                    </h2>
                    <span>{participantes.length}</span>
                </div>

                {participantes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 bg-bg-secondary rounded-2xl border border-dashed border-border-primary">
                        <p className="text-text-secondary font-medium italic">
                            Esperando conexiones desde la extensión...
                        </p>
                    </div>
                ) : (
                    <StudentList students={participantes} onlyData={true} />
                )}
            </div>
        </div>
    );
};

export default ExamenLobbyPage;
