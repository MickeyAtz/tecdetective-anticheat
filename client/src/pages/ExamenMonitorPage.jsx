import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

import { getExamenById } from '@/api/examenes.api';

import Card from '@/components/molecules/Card.jsx';
import StudentList from '@/components/molecules/StudentList.jsx';

const ExamenMonitorPage = () => {
    const { id } = useParams();

    const [examen, setExamen] = useState([]);
    const [participantes, setParticipantes] = useState([]);

    useEffect(() => {
        fetchData();
    }, [id]);

    async function fetchData() {
        if (!id) return null;
        try {
            const result = await getExamenById(id);
            setExamen(result);
        } catch (err) {
            console.error('Error al obtener los datos: ', err);
        }
    }

    const totalAlumnos = 0;

    if (!examen) return null;

    return (
        <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
            {/* INFORMACION DEL EXAMEN */}
            <header className="flex justify-between items-start border-b border-border-primary pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">
                        Monitoreo del examen: {examen.titulo}
                    </h1>
                    <div className="text-sm text-text-secondary mt-1 justify-between grid grid-cols md:grid-cols-3">
                        <span>Duracion del examen: {examen.duracion_minutos}</span>
                        <span>Grupo: {examen.grupo_nombre}</span>
                        <span>Materia: {examen.materia_nombre}</span>
                    </div>
                </div>
            </header>

            {/* TARJETAS DE RESUMEN */}
            <section className="grid grid-cols1 md:grid-cols-2 gap-4">
                <Card title="Total de Participantes"></Card>
                <Card title="Incidentes detectados"></Card>
            </section>
            {/* LISTA DE PARTICIPANTES E INCIDENTES */}
            {totalAlumnos > 0 ? (
                <section></section>
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

export default ExamenMonitorPage;
