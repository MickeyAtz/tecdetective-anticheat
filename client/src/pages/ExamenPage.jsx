import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Importación de componentes
import Button from '@/components/atoms/Button.jsx';
import ExamenCard from '@/components/molecules/ExamenCard.jsx';
import ExamenModal from '@/components/organism/ExamenModal.jsx';
import Modal from '@/components/atoms/Modal.jsx';
import Alerta from '@/components/atoms/Alerta.jsx';
import Select from '@/components/atoms/Select.jsx';
// Importación de APIs
import { getExamenes, deleteExamen, cambiarEstadoExamen } from '@/api/examenes.api.js';
import { getGrupos } from '@/api/grupos.api.js';
import { getMateriasAsignadas } from '@/api/grupo_materias.api.js';

const selectEstadoConfig = [
    { value: 'TODOS', label: 'Todos' },
    { value: 'EN_CURSO', label: 'En curso (espera/activo)' },
    { value: 'PENDIENTE', label: 'Asignados' },
    { value: 'FINALIZADO', label: 'Finalizados' },
];

export const ExamenPage = () => {
    const navigate = useNavigate();
    // informacion de los examenes
    const [examenes, setExamenes] = useState([]);
    const [deleteData, setDeleteData] = useState(null);
    // informacion de los selects
    const [grupos, setGrupos] = useState([]);
    const [materias, setMaterias] = useState([]);

    // filtros
    const [filtroActual, setFiltroActual] = useState('TODOS'); // 'TODOS', 'PENDIENTE', 'EN_CURSO', 'FINALIZADO'
    const [filtroGrupos, setFiltroGrupos] = useState('TODOS');
    const [filtroMaterias, setFiltroMaterias] = useState('');

    // gestion de estados del modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [examenAEditar, setExamenAEditar] = useState(null);

    const fetchExamenes = async () => {
        try {
            const data = await getExamenes();
            setExamenes(data);
        } catch (error) {
            console.error('Error al traer exámenes', error);
        }
    };

    const fetchGrupos = async () => {
        try {
            const data = await getGrupos();
            setGrupos(data);
        } catch (err) {
            console.error('Error al cargar grupos: ', err);
        }
    };

    const fetchMateriasGrupo = async (grupo_id) => {
        try {
            const data = await getMateriasAsignadas(grupo_id);
            setMaterias(data);
        } catch (err) {
            console.error('Error al cargar materias del grupo: ', err);
        }
    };

    useEffect(() => {
        fetchExamenes();
        fetchGrupos();
    }, []);

    const examenesFiltrados = examenes.filter((examen) => {
        const pasaEstado =
            filtroActual === 'TODOS' ||
            (filtroActual === 'EN_CURSO' &&
                (examen.estado === 'ESPERA' || examen.estado === 'ACTIVO')) ||
            examen.estado === filtroActual;

        const pasaGrupo =
            filtroGrupos === 'TODOS' || String(examen.grupo_id) === String(filtroGrupos);

        const pasaMateria =
            filtroMaterias === 'TODAS' ||
            filtroMaterias === '' ||
            String(examen.materia_id) === String(filtroMaterias);

        return pasaEstado && pasaGrupo && pasaMateria;
    });

    const handleAbrirModalCrear = () => {
        setExamenAEditar(null);
        setIsModalOpen(true);
    };

    const handleAbrirModalEditar = (examen) => {
        setExamenAEditar(examen);
        setIsModalOpen(true);
    };

    const handleCerrarModal = () => {
        setIsModalOpen(false);
        setExamenAEditar(null);
    };

    const handleDelete = (examen) => {
        setDeleteData(examen);
    };

    const handleConfirmDelete = async () => {
        if (!deleteData) return;
        try {
            await deleteExamen(deleteData);
            fetchExamenes();
        } catch (err) {
            console.error(err);
        } finally {
            setDeleteData(null);
        }
    };

    const handleStatusChange = async (id, nuevoEstado) => {
        try {
            await cambiarEstadoExamen(id, nuevoEstado);
            fetchExamenes();
        } catch (error) {
            console.error('Error al cambiar estado', error);
        }
    };

    const handleGrupoChange = (grupo_id) => {
        setFiltroGrupos(grupo_id);
        setFiltroMaterias('TODAS');

        if (grupo_id !== 'TODOS') {
            fetchMateriasGrupo(grupo_id);
        } else {
            setMaterias([]);
        }
    };

    const opcionesGrupos = [
        { value: 'TODOS', label: 'Todos los grupos' },
        ...grupos.map((g) => ({ value: g.id, label: g.nombre })),
    ];

    const opcionesMaterias = [
        { value: 'TODAS', label: 'Todas las materias' },
        ...materias.map((m) => ({ value: m.id, label: m.nombre })),
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* CABECERA */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-text-primary">Mis Exámenes</h1>
                    <p className="text-text-tertiary mt-1">
                        Gestiona tus evaluaciones y controla el acceso en tiempo real.
                    </p>
                </div>
                <Button
                    variant="primary"
                    onClick={handleAbrirModalCrear}
                    className="flex items-center gap-2"
                >
                    Nuevo Examen
                </Button>
            </div>

            {/* BOTONERA DE FILTROS */}
            <div className="flex overflow-x-auto gap-2 mb-8 pb-2 border-b border-border-primary">
                <Select
                    label="Estado"
                    options={selectEstadoConfig}
                    value={filtroActual}
                    onChange={(valor) => setFiltroActual(valor)}
                />
                <Select
                    label="Grupo"
                    options={opcionesGrupos}
                    value={filtroGrupos}
                    onChange={(valor) => handleGrupoChange(valor)}
                />
                <Select
                    label="Materia"
                    options={opcionesMaterias}
                    value={filtroMaterias}
                    onChange={(valor) => setFiltroMaterias(valor)}
                    disabled={filtroGrupos === 'TODOS'}
                />
            </div>

            {/* GRID DE TARJETAS */}
            {examenesFiltrados.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {examenesFiltrados.map((examen) => (
                        <ExamenCard
                            key={examen.id}
                            examen={examen}
                            onEdit={() => handleAbrirModalEditar(examen)}
                            onDelete={() => handleDelete(examen.id)}
                            onStatusChange={handleStatusChange}
                            onViewMonitor={(id) => navigate(`/examen/monitor/${id}`)}
                            onViewResults={(id) => navigate(`/examen/resultados/${id}`)}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-bg-primary-50 border-2 border-dashed border-border-primary rounded-2xl p-20 text-center">
                    <p className="text-slate-500 text-lg font-medium">
                        No hay exámenes en esta categoría.
                    </p>
                </div>
            )}

            {/* MODAL DE CREACIÓN / EDICIÓN */}
            <ExamenModal
                isOpen={isModalOpen}
                onClose={handleCerrarModal}
                examenAEditar={examenAEditar}
                onExamenGuardado={fetchExamenes}
            />
            {/* MODAL DE CONFIRMACION DE ELIMINACION*/}
            <Modal
                title="Confirmar Eliminación"
                isOpen={deleteData != null}
                onClose={() => setDeleteData(null)}
            >
                <div className="flex flex-col gap-6 p-2">
                    <div>
                        <br />
                        <p>¿Estás seguro de eliminar este exámen?</p>
                        <br />
                        <Alerta type="info">Esta opción no se puede deshacer.</Alerta>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="danger" size="md" onClick={handleConfirmDelete}>
                            Si, Eliminar
                        </Button>
                        <Button
                            variant="secondary"
                            size="md"
                            onClick={() => {
                                setDeleteData(null);
                            }}
                        >
                            Cancelar
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ExamenPage;
