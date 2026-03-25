import React, { useState, useEffect } from 'react';

import Modal from '@/components/atoms/Modal.jsx';
import Input from '@/components/atoms/Input.jsx';
import Select from '@/components/atoms/Select.jsx';
import Button from '@/components/atoms/Button.jsx';

import { createExamen, modifyExamen } from '@/api/examenes.api.js';
import { getGrupos } from '@/api/grupos.api.js';
import { getMateriasAsignadas } from '@/api/grupo_materias.api.js';

export const ExamenModal = ({ isOpen, onClose, examenAEditar, onExamenGuardado }) => {
    const [grupos, setGrupos] = useState([]);
    const [materias, setMaterias] = useState([]);

    const [formData, setFormData] = useState({
        titulo: '',
        codigo_acceso: '',
        duracion_minutos: 60,
        grupo_id: '',
        materia_id: '',
        programed_at: '',
        estado: 'PENDIENTE',
    });

    useEffect(() => {
        if (isOpen) {
            cargarGrupos();
            if (examenAEditar) {
                setFormData({
                    titulo: examenAEditar.titulo,
                    codigo_acceso: examenAEditar.codigo_acceso,
                    duracion_minutos: examenAEditar.duracion_minutos,
                    grupo_id: examenAEditar.grupo_id,
                    materia_id: examenAEditar.materia_id,
                    programed_at: examenAEditar.programed_at.slice(0, 16),
                });
            } else {
                setFormData({
                    titulo: '',
                    codigo_acceso: Math.random().toString(36).substring(2, 8).toUpperCase(),
                    duracion_minutos: 60,
                    grupo_id: '',
                    materia_id: '',
                    programed_at: '',
                });
                setMaterias([]);
            }
        }
    }, [isOpen, examenAEditar]);

    useEffect(() => {
        if (formData.grupo_id) {
            cargarMateriasDelGrupo(formData.grupo_id);
        } else {
            setMaterias([]);
        }
    }, [formData.grupo_id]);

    const cargarGrupos = async () => {
        try {
            const data = await getGrupos();
            setGrupos(data);
        } catch (err) {
            console.error('Error al cargar grupos: ', err);
        }
    };

    const cargarMateriasDelGrupo = async (grupo_id) => {
        try {
            const data = await getMateriasAsignadas(grupo_id);
            setMaterias(data);
        } catch (err) {
            console.error('Error al cargar materias: ', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (name, value) => {
        setFormData((prev) => {
            const newData = {
                ...prev,
                [name]: value,
            };
            if (name === 'grupo_id') newData.materia_id = '';
            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitData = { ...formData, estado: 'PENDIENTE' };
        try {
            if (examenAEditar) {
                await modifyExamen(examenAEditar.id, submitData);
            } else {
                await createExamen(submitData);
            }
            onExamenGuardado();
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    const opcionesGrupos = grupos.map((g) => ({ value: String(g.id), label: g.nombre }));
    const opcionesMaterias = materias.map((m) => ({ value: String(m.id), label: m.nombre }));

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={examenAEditar ? 'Editar Examen' : 'Crear Nuevo Examen'}
            size="lg"
        >
            <form onSubmit={handleSubmit}>
                <Input
                    label="Título del Examen"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    required
                />

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Grupo"
                        name="grupo_id"
                        options={opcionesGrupos}
                        value={String(formData.grupo_id || '')}
                        onChange={(valor) => handleSelectChange('grupo_id', valor)}
                        placeholder="Selecciona un grupo..."
                        required
                    />

                    <Select
                        label="Materia"
                        name="materia_id"
                        options={opcionesMaterias}
                        value={String(formData.materia_id || '')}
                        onChange={(valor) => handleSelectChange('materia_id', valor)}
                        placeholder={
                            materias.length === 0
                                ? 'Selecciona grupo primero'
                                : 'Selecciona materia...'
                        }
                        disabled={!formData.grupo_id || materias.length === 0}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Código de Acceso"
                        name="codigo_acceso"
                        value={formData.codigo_acceso}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Duración (Minutos)"
                        type="number"
                        name="duracion_minutos"
                        value={formData.duracion_minutos}
                        onChange={handleChange}
                        required
                    />
                </div>

                <Input
                    label="Fecha y Hora Programada"
                    type="datetime-local"
                    name="programed_at"
                    value={formData.programed_at}
                    onChange={handleChange}
                    required
                />

                <div className="flex justify-end gap-3 mt-6">
                    <Button type="button" variant="danger" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="primary">
                        {examenAEditar ? 'Guardar Cambios' : 'Crear Examen'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default ExamenModal;
