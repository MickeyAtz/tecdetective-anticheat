import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

import { getHistorialExamen } from '@/api/examenes.api.js';
import { exportarExamen } from '@/utils/exportToExcel';

import StudentList from '@/components/molecules/StudentList.jsx';
import ExamenHeader from '@/components/organism/ExamenHeader.jsx';
import ExamenSection from '@/components/organism/ExamenSection.jsx';
import StatsCard from '@/components/atoms/StatsCards.jsx';
import EmptyState from '@/components/atoms/EmptyState.jsx';
import Button from '@/components/atoms/Button.jsx';

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
            console.log(result.examenResult);
            setParticipantes(result.participantesResult);
        } catch (err) {
            console.error('Error al obtener los datos: ', err);
        }
    }

    // Informacion de los KPIs (CARDS de datos)
    const alumnosConIncidentes = participantes.filter((p) => p.incidentes?.length > 0).length;

    const incidentesDetectados = participantes.reduce(
        (acumulador, p) => acumulador + p.incidentes?.length,
        0
    );

    const handleExportarDatos = async () => {
        try {
            exportarExamen(examen, participantes);
            toast.success('Exportación realizada con éxito');
        } catch (err) {
            console.error(err);
            toast.error('Hubo un fallo al obtener los datos del servidor.');
        }
    };

    const totalAlumnos = participantes.length;

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
                type="historial"
                examen={examen}
                primaryAction={
                    <Button variant="primary" size="lg" onClick={handleExportarDatos}>
                        Exportar datos
                    </Button>
                }
            />

            {/* KPIs */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatsCard title="Participantes" value={totalAlumnos} />

                <StatsCard
                    title="Con incidentes"
                    value={alumnosConIncidentes}
                    color="text-yellow-600"
                />

                <StatsCard
                    title="Alertas detectadas"
                    value={incidentesDetectados}
                    color="text-red-600"
                />

                <StatsCard
                    title="Fecha"
                    value={new Date(examen.programed_at).toLocaleDateString('es-MX')}
                    color="text-zinc-600"
                />
            </section>

            {/* PARTICIPANTES */}
            <ExamenSection title="Registro de alumnos">
                {totalAlumnos > 0 ? (
                    <StudentList students={participantes} />
                ) : (
                    <EmptyState message="No se encontraron participantes registrados." />
                )}
            </ExamenSection>
        </motion.div>
    );
};

export default ExamenHistorial;
