import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

import { cambiarEstadoExamen } from '@/api/examenes.api.js';

import Card from '@/components/molecules/Card.jsx';
import Button from '@/components/atoms/Button.jsx';
import StudentList from '@/components/molecules/StudentList.jsx';

const ExamenLobbyPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [participantes, setParticipantes] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Conexion al servidor WEBSOCKET
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);

        // Unirse al loby
        newSocket.on('connect', () => {
            newSocket.emit('unirse_examen', {
                idExamen: id,
                rol: 'profesor',
            });

            newSocket.emit('solicitar_conectados', id, (participantesConectados) => {
                setParticipantes(participantesConectados);
                console.log('Participantes en loby al reconectar: ', participantesConectados);
            });
        });

        // Agregar nuevo participante al lobby
        newSocket.on('nuevo_participante', (alumno) => {
            setParticipantes((prev) => {
                if (prev.some((p) => p.nControl === alumno.nControl)) return prev;
                return [...prev, alumno];
            });
        });

        // Cierre de conexion al desmontar el componente.
        return () => {
            newSocket.disconnect();
        };
    }, [id]);

    const handleIniciarExamen = async () => {
        if (socket) {
            const configInicio = {
                claveExamen: id,
                horaInicioReal: new Date().toISOString(),
            };
            // emitimos la orden de inicio y mandamos informacion del inicio
            socket.emit('iniciar_examen_profesor', configInicio);

            // Cambiar el estado del examen
            await cambiarEstadoExamen(id, 'ESPERA');

            // redirigimos a la pagina de monitoreo
            navigate(`/examen/monitor${id}`);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Card>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="tex-3xl font-bold text-text-primary">
                        Sala de espera del examen: examen.titulo
                    </h1>
                    <Button
                        onClick={handleIniciarExamen}
                        disabled={participantes.length === 0}
                        variant="primary"
                    >
                        Comenzar Examen
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
                        <div className="animate-bounce mb-4 text-text-primary">
                            <svg
                                className="w-12 h-12"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                            </svg>
                        </div>
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
