import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

import { cambiarEstadoExamen, getExamenById } from '@/api/examenes.api.js';

import Card from '@/components/molecules/Card.jsx';
import Button from '@/components/atoms/Button.jsx';
import StudentList from '@/components/molecules/StudentList.jsx';

const ExamenLobbyPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [participantes, setParticipantes] = useState([]);
    const [examen, setExamen] = useState(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            newSocket.emit('unirse_examen', {
                usuario: null,
                examen: {
                    idExamen: id,
                },
                rol: 'profesor',
            });

            newSocket.emit('solicitar_conectados', id, (participantesConectados) => {
                setParticipantes(participantesConectados);
            });
        });

        newSocket.on('nuevo_participante', (usuario) => {
            setParticipantes((prev) => {
                if (prev.some((p) => p.nControl === usuario.nControl)) return prev;
                return [...prev, usuario];
            });
        });

        return () => {
            newSocket.disconnect();
        };
    }, [id]);

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
