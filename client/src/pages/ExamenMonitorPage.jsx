import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useSocket } from '@/context/SocketContext';
import { getExamenById } from '@/api/examenes.api';

import Card from '@/components/molecules/Card.jsx';
import StudentList from '@/components/molecules/StudentList.jsx';

const ExamenMonitorPage = () => {
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
            const participantesIniciales = participantesConectados.map((p) => ({
                ...p,
                status: 'success',
                incidentes: [],
            }));
            setParticipantes(participantesIniciales);
        });

        // --- LISTENERS ---

        const handleAlerta = (dataIncidente) => {
            setParticipantes((prev) =>
                prev.map((estudiante) => {
                    if (estudiante.nControl === dataIncidente.nControl) {
                        const nuevosIncidentes = [dataIncidente, ...estudiante.incidentes];

                        let nuevoStatus = 'success';
                        if (nuevosIncidentes.length === 1) nuevoStatus = 'warning';
                        if (nuevosIncidentes.length >= 2) nuevoStatus = 'danger';

                        return {
                            ...estudiante,
                            incidentes: nuevosIncidentes,
                            status: nuevoStatus,
                        };
                    }
                    return estudiante;
                })
            );
        };

        const handleNuevoParticipante = (usuario) => {
            setParticipantes((prev) => {
                const existe = prev.find((p) => p.nControl === usuario.nControl);

                if (existe) {
                    return prev.map((p) => {
                        if (p.nControl === usuario.nControl) {
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

    if (!examen) return null;

    return (
        <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
            {/* INFORMACION DEL EXAMEN */}
            <header className="flex justify-between items-start border-b border-border-primary pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">
                        Monitoreo del examen: {examen.titulo}
                    </h1>
                    <div className="text-sm text-text-secondary mt-1 justify-between grid grid-cols md:grid-cols-3 gap-4">
                        <span>Duracion del examen: {examen.duracion_minutos} min</span>
                        <span>Grupo: {examen.grupo_nombre}</span>
                        <span>Materia: {examen.materia_nombre}</span>
                    </div>
                </div>
            </header>

            {/* TARJETAS DE RESUMEN */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card title="Total de Participantes">
                    <p className="text-3xl font-bold text-text-primary">{participantes.length}</p>
                </Card>
                <Card title="Incidentes detectados">
                    <p
                        className={`text-3xl font-bold ${totalIncidentesGlobales > 0 ? 'text-red-600' : 'text-green-600'}`}
                    >
                        {totalIncidentesGlobales}
                    </p>
                </Card>
            </section>

            {/* LISTA DESPLEGABLE DE PARTICIPANTES (AHORA OCUPA TODO EL ANCHO) */}
            <section className="bg-bg-primary rounded-xl p-4 shadow-sm border border-border-primary">
                <h2 className="text-xl font-semibold mb-6 text-text-primary">
                    Participantes Activos
                </h2>

                {participantes.length > 0 ? (
                    <StudentList students={participantes} />
                ) : (
                    <div className="bg-bg-primary-50 border-2 border-dashed border-border-primary rounded-2xl p-20 text-center">
                        <p className="text-text-tertiary text-lg font-medium">
                            No se encontraron participantes.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ExamenMonitorPage;
