import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '@/context/SocketContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

import {
    getExamenById,
    getParticipantesEIncidentesByExamen,
    cambiarEstadoExamen,
} from '@/api/examenes.api';

import Card from '@/components/molecules/Card.jsx';
import StudentList from '@/components/molecules/StudentList.jsx';
import Button from '@/components/atoms/Button.jsx';
import ExamenHeader from '@/components/organism/ExamenHeader.jsx';
import StatsCard from '@/components/atoms/StatsCards.jsx';
import ExamenSection from '@/components/organism/ExamenSection.jsx';
import EmptyState from '@/components/atoms/EmptyState';

const ExamenMonitorPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const socket = useSocket();

    const [examen, setExamen] = useState(null);
    const [participantes, setParticipantes] = useState([]);

    useEffect(() => {
        async function fetchData() {
            if (!id) return;
            try {
                const result = await getExamenById(id);
                setExamen(result);
            } catch (err) {
                console.error('Error al obtener los datos del examen: ', err);
            }
        }
        async function fetchParticipantes() {
            try {
                const result = await getParticipantesEIncidentesByExamen(id);

                const dataLista = result.map((alumno) => {
                    let statusInicial = 'success';
                    if (alumno.incidentes.length === 1) statusInicial = 'warning';
                    if (alumno.incidentes.length >= 3) statusInicial = 'danger';

                    return { ...alumno, status: statusInicial };
                });
                console.log(dataLista);
                setParticipantes(dataLista);
            } catch (error) {
                console.error('Error al obtener participantes e historial:', error);
            }
        }

        fetchParticipantes();
        fetchData();
    }, [id]);

    useEffect(() => {
        if (!socket) return;

        if (!socket.connected) {
            socket.connect();
            socket.emit('unirse_examen', {
                usuario: null,
                examen: { idExamen: id },
                rol: 'profesor',
            });
        }

        socket.emit('solicitar_conectados', id, (participantesConectados) => {
            setParticipantes((prev) => {
                return prev.map((p) => {
                    const estadoConectado = participantesConectados.find(
                        (c) => c.nControl === p.nControl
                    );
                    if (!estadoConectado) {
                        return { ...p, status: 'offline' };
                    }
                    return p;
                });
            });
        });

        // Actualizacion de alertas en tiempo real
        const handleAlerta = (dataIncidente) => {
            setParticipantes((prev) => {
                if (!prev) return [];

                return prev.map((estudiante) => {
                    const idEstudiante = String(
                        estudiante.nControl || estudiante.ncontrol || ''
                    ).trim();
                    const idAlerta = String(
                        dataIncidente.nControl || dataIncidente.ncontrol || ''
                    ).trim();

                    if (idEstudiante === idAlerta && idEstudiante !== '') {
                        const nuevoIncidente = {
                            tipo: dataIncidente.tipo,
                            detalle: dataIncidente.detalle,
                            hora: dataIncidente.hora || new Date().toLocaleTimeString(),
                        };

                        const incidentesActualizados = [
                            nuevoIncidente,
                            ...(estudiante.incidentes || []),
                        ];

                        let nuevoStatus = 'success';
                        if (incidentesActualizados.length >= 1) nuevoStatus = 'warning';
                        if (incidentesActualizados.length >= 5) nuevoStatus = 'danger';

                        return {
                            ...estudiante,
                            incidentes: incidentesActualizados,
                            status: nuevoStatus,
                        };
                    }
                    return estudiante;
                });
            });
        };

        // Actualizacion de usuarios en tiempor eal
        const handleNuevoParticipante = (usuario) => {
            setParticipantes((prev) => {
                const existe = prev.find((p) => p.nControl === usuario.nControl);

                if (existe) {
                    return prev.map((p) => {
                        if (String(p.nControl) === String(usuario.nControl)) {
                            let statusRecuperado = 'success';
                            if (p.incidentes.length === 1) statusRecuperado = 'warning';
                            if (p.incidentes.length >= 2) statusRecuperado = 'danger';
                            return { ...p, status: statusRecuperado };
                        }
                        return p;
                    });
                }

                return [...prev, { ...usuario, status: 'success', incidentes: [] }];
            });
        };

        // handle desconexion del usuario
        const handleDesconexion = (data) => {
            setParticipantes((prev) =>
                prev.map((estudiante) => {
                    if (estudiante.nControl === data.nControl) {
                        const incidenteDesconexion = {
                            tipo: 'DESCONEXIÓN',
                            detalle: 'El alumno perdió conexión con el servidor.',
                            hora: new Date().toLocaleTimeString(),
                        };
                        return {
                            ...estudiante,
                            status: 'offline',
                            incidentes: [incidenteDesconexion, ...estudiante.incidentes],
                        };
                    }
                    return estudiante;
                })
            );
        };

        socket.on('alerta_profesor', handleAlerta);
        socket.on('nuevo_participante', handleNuevoParticipante);
        socket.on('participante_desconectado', handleDesconexion);

        return () => {
            socket.off('alerta_profesor', handleAlerta);
            socket.off('nuevo_participante', handleNuevoParticipante);
            socket.off('participante_desconectado', handleDesconexion);
        };
    }, [socket, id]);

    const totalIncidentesGlobales = participantes.reduce(
        (acc, p) => acc + (p.incidentes?.length || 0),
        0
    );

    const handleFinalizarExamen = async () => {
        const confirmar = window.confirm(
            'Estás seguro de terminar el examen? Esto cerrará las conexiones de los participantes.'
        );

        if (!confirmar) return;

        try {
            await cambiarEstadoExamen(id, 'FINALIZADO');

            socket.emit('profesor_finaliza_examen', { idExamen: id });

            navigate(`/examen/resultados/${id}`);
        } catch (error) {
            console.error(error);
        }
    };

    if (!examen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="max-w-7xl mx-auto p-6 flex flex-col gap-6"
        >
            {/* HEADER */}
            <ExamenHeader
                type="monitor"
                examen={examen}
                primaryAction={
                    <Button variant="danger" size="lg" onClick={handleFinalizarExamen}>
                        Finalizar examen
                    </Button>
                }
            />

            {/* KPIs */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatsCard title="Participantes activos" value={participantes.length} />

                <StatsCard
                    title="Incidentes detectados"
                    value={totalIncidentesGlobales}
                    color={totalIncidentesGlobales > 0 ? 'text-red-600' : 'text-green-600'}
                />

                <StatsCard
                    title="Desconectados"
                    value={participantes.filter((p) => p.status === 'offline').length}
                    color="text-yellow-600"
                />
            </section>

            {/* LISTA DE PARTICIPANTES */}
            <ExamenSection title="Monitoreo de participantes">
                {participantes.length > 0 ? (
                    <StudentList students={participantes} />
                ) : (
                    <EmptyState message="No se encontraron participantes conectados." />
                )}
            </ExamenSection>
        </motion.div>
    );
};

export default ExamenMonitorPage;
