import React, { useState, useEffect } from 'react';

import {
    getMateriasAsignadas,
    getMateriasDisponibles,
    asignarMateria,
    deleteAsignacion,
} from '@/api/grupo_materias.api.js';

import { HiOutlinePlusCircle, HiMiniXCircle } from 'react-icons/hi2';
import { HiOutlineSearch } from 'react-icons/hi';

import Button from '@/components/atoms/Button.jsx';
import Input from '@/components/atoms/Input.jsx';

const SubjectManager = ({ grupoId, nombreGrupo }) => {
    const [materiasAsignadas, setMateriasAsignadas] = useState([]);
    const [materiasDisponibles, setMateriasDisponibles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (grupoId) fetchData();
    }, [grupoId]);

    const fetchData = async () => {
        try {
            const [resAsignadas, resDisponibles] = await Promise.all([
                getMateriasAsignadas(grupoId),
                getMateriasDisponibles(grupoId),
            ]);
            setMateriasAsignadas(resAsignadas || []);
            setMateriasDisponibles(resDisponibles || []);
        } catch (err) {
            console.error('Error al cargar datos:', err);
        }
    };

    const handleAsign = async (materiaId) => {
        if (!materiaId) return;
        try {
            await asignarMateria(grupoId, materiaId);
            fetchData();
        } catch (err) {
            console.error('Error al asignar:', err);
        }
    };

    const handleDeleteMateria = async (materiaId) => {
        if (!materiaId) return;

        console.log('materia id', materiaId);
        console.log(grupoId);
        try {
            await deleteAsignacion(grupoId, materiaId);
            fetchData();
        } catch (err) {
            console.error('Error al eliminar:', err);
        }
    };

    const filteredMaterias = materiasDisponibles.filter((m) =>
        m.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const ListItem = ({ materia, icon: Icon, variant, onClick, actionLabel }) => (
        <div className="flex items-center justify-between p-3 mb-2 bg-bg-secondary border border-border-primary rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-text-primary">{materia.nombre}</span>
            </div>
            <Button variant={variant} size="sm" icon={Icon} onClick={onClick} title={actionLabel} />
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row gap-8 h-137.5 p-2">
            {/* PANEL IZQUIERDO: MATERIAS ASIGNADAS (Tema Neutro) */}
            <div className="flex-1 flex flex-col min-h-0 bg-bg-tertiary/40 rounded-2xl p-5 border border-border-primary">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-text-primary">Materias en el Grupo</h3>
                    <p className="text-xs text-text-secondary font-medium">
                        Asignadas a: {nombreGrupo}
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {materiasAsignadas.length > 0 ? (
                        materiasAsignadas.map((materia) => (
                            <ListItem
                                key={`asignada-${materia.id}`}
                                materia={materia}
                                icon={HiMiniXCircle}
                                variant="danger" // Asumo que tu átomo Button maneja este variant
                                actionLabel="Quitar"
                                onClick={() => handleDeleteMateria(materia.id)}
                            />
                        ))
                    ) : (
                        <div className="text-center py-10 text-text-tertiary italic text-sm bg-bg-secondary/30 rounded-xl border border-dashed border-border-primary">
                            No hay materias asignadas aún.
                        </div>
                    )}
                </div>
            </div>

            {/* PANEL DERECHO: CATÁLOGO (Acento con Brand Primary) */}
            <div className="w-full md:w-85 flex flex-col bg-bg-secondary rounded-2xl p-5 border-2 border-brand-primary/10 shadow-sm">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-brand-primary">Catálogo</h3>
                    <div className="mt-3">
                        <Input
                            placeholder="Buscar materia..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon={HiOutlineSearch}
                            className="bg-bg-tertiary border-none focus:ring-2 focus:ring-brand-primary"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                    {filteredMaterias.length > 0 ? (
                        filteredMaterias.map((materia) => (
                            <ListItem
                                key={`disponible-${materia.id}`}
                                materia={materia}
                                icon={HiOutlinePlusCircle}
                                variant="primary"
                                actionLabel="Asignar"
                                onClick={() => handleAsign(materia.id)}
                            />
                        ))
                    ) : (
                        <div className="text-center py-10 text-text-tertiary italic text-sm">
                            {searchTerm ? 'Sin coincidencias' : 'Cargando materias...'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubjectManager;
