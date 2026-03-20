import React, { useState, useEffect } from 'react';

import {
    getMateriasAsignadas,
    getMateriasDisponibles,
    asignarMateria,
    deleteAsignacion,
} from '@/api/grupo_materias.api.js';
import { getMaterias } from '@/api/materias.api.js';


import { HiOutlinePlusCircle, HiMiniXCircle } from 'react-icons/hi2';

import Button from '@/components/atoms/Button.jsx';
import Table from '@/components/organism/Table.jsx';

const colsTable = [{ field: 'nombre', label: 'Nombre' }];

const SubjectManager = ({ grupoId, nombreGrupo }) => {
    const [materias, setMaterias] = useState([]);
    const [materiasAsignadas, setMateriasAsignadas] = useState([]);

    useEffect(() => {
        fetchMateriasDisponibles();
        fetchMateriasAsignadas();
    }, []);

    const fetchMateriasDisponibles = async () => {};

    const fetchMateriasAsignadas = async () => {
        const { materias } = await getMaterias();
        const materiasFechaFormateada = materias.map((materia) => ({
            ...materia,
            creado_at: new Date(materia.creado_at).toLocaleDateString('es-MX'),
        }));
        setMaterias(materiasFechaFormateada);
    };

    const handleAsign = async (materia) => {
        if (materia) return;
        try {
            await asignarMateria(grupoId, materia.id);
            fetchMaterias();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteMateria = async (materia) => {
        if (materia) return;
        try {
            await deleteAsignacion(grupoId, materia.id);
            fetchMaterias();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Table
                title="Materias Asignadas"
                columns={colsTable}
                data={materias}
                renderActions={(materia) => (
                    <>
                        {/*BOTON ELIMINAR*/}
                        <Button
                            title="eliminar"
                            variant="secondary"
                            onClick={() => handleDeleteMateria(materia)}
                            icon={HiMiniXCircle}
                        ></Button>
                    </>
                )}
            />
            <Table
                title="Asignar Materias"
                columns={colsTable}
                data={filteredMaterias}
                renderActions={(materia) => (
                    <>
                        <Button
                            title="asignar"
                            variant="primary"
                            onClick={() => handleAsign(materia)}
                            icon={HiOutlinePlusCircle}
                        />
                    </>
                )}
            />
        </>
    );
};

export default SubjectManager;
