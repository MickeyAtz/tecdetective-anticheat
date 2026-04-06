import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getHistorialExamen } from '@/api/examenes.api.js';

import StudentList from '@/components/molecules/StudentList.jsx';
import Card from '@/components/molecules/Card.jsx';

const ExamenHistorial = () => {
    const { id } = useParams();

    const [examen, setExamen] = useState(null);
    const [participantes, setParticipantes] = useState([]);

    useEffect(() => {
        fetchData();
    }, [id]);

    async function fetchData() {
        if (!id) return null;
        try {
            const result = await getHistorialExamen(id);
            setExamen(result.examenResult);
            setParticipantes(result.participantesResult);
        } catch (err) {
            console.error('Error al obtener los datos: ', err);
        }
    }

    // Informacion de los KPIs (CARDS de datos)
    const alumnosConIncidentes = participantes.filter((p) => p.incidentes > 0).length;

    const incidentesDetectados = participantes.reduce(
        (acumulador, p) => acumulador + p.incidentes.length,
        0
    );

    const totalAlumnos = participantes.length;

    if (!examen) return null;

    return (
        <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
            {/* INFORMACION DEL EXAMEN */}
            <header className="flex justify-between items-start border-b border-border-primary pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">
                        Historial del examen: {examen.titulo}
                    </h1>
                    <p className="text-sm text-text-secondary mt-1">
                        Aplicado el: {new Date(examen.programed_at).toLocaleDateString('es-MX')} |
                        Duracion: {examen.duracion_minutos}
                        Materia: Materia del examen Grupo: Grupo del examen
                    </p>
                </div>
                <div className="bg-bg-tertiary text-status-success boder border-border-primary px-3 py-1 rounded-full text-sm font-medium">
                    Finalizado
                </div>
            </header>

            {/* TARJETAS DE RESUMEN */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card title="Total Participantes">
                    <p className="text-3xl font-semibold text-brand-primary">{totalAlumnos}</p>
                </Card>

                <Card title="Alumnos con Incidentes">
                    <p className="text-3xl font-semibold text-status-warning">
                        {alumnosConIncidentes}
                    </p>
                </Card>

                <Card title="Alertas Detectadas">
                    <p className="text-3xl font-semibold text-status-danger">
                        {incidentesDetectados}
                    </p>
                </Card>
            </section>

            {/* TABLA DE PARTICIPANTES */}
            {totalAlumnos > 0 ? (
                <section className="flex flex-col gap-4">
                    <h2 className="text-lg font-bold text-text-primary">Registro de Alumnos</h2>
                    <StudentList students={participantes} />
                </section>
            ) : (
                <div className="bg-bg-primary-50 border-2 border-dashed border-border-primary rounded-2xl p-20 text-center">
                    <p className="text-text-tertiary text-lg font-medium">
                        No se encontraron participantes.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ExamenHistorial;
