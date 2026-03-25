import React, { useState, useEffect } from 'react';
import { getGrupos, createGrupo, deleteGrupo, editGrupo } from '@/api/grupos.api.js';

import Card from '@/components/molecules/Card.jsx';
import Button from '@/components/atoms/Button.jsx';
import Table from '@/components/organism/Table.jsx';
import Modal from '@/components/atoms/Modal.jsx';
import Form from '@/components/molecules/Form.jsx';
import Alerta from '@/components/atoms/Alerta.jsx';
import SubjectManager from '@/components/molecules/SubjectManager.jsx';
import { HiTrash, HiOutlinePencil, HiOutlineBookOpen } from 'react-icons/hi';

const columns = [
    { field: 'nombre', label: 'Nombre' },
    { field: 'ciclo_escolar', label: 'Ciclo escolar' },
    { field: 'creado_at', label: 'Fecha de creación' },
];

const formFields = [
    {
        name: 'nombre',
        label: 'Nombre del Grupo',
        type: 'text',
        placeholder: 'Ej. Base de Datos',
    },
    {
        name: 'ciclo_escolar',
        label: 'Ciclo escolar',
        type: 'text',
        placeholder: 'Ej. 2026A',
    },
];

const GruposPage = () => {
    const [grupos, setGrupos] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalSubjects, setModalSubjects] = useState(false);

    const [editData, setEditData] = useState(null);
    const [grupoMaterias, setGrupoMaterias] = useState(null);
    const [deleteData, setDeleteData] = useState(null);

    useEffect(() => {
        fetchGrupos();
    }, []);

    const fetchGrupos = async () => {
        try {
            const grupos = await getGrupos();
            const grupoFechaFormateada = grupos.map((grupo) => ({
                ...grupo,
                creado_at: new Date(grupo.creado_at).toLocaleDateString('es-MX'),
            }));
            setGrupos(grupoFechaFormateada);
        } catch (err) {
            console.error('Error al obtener grupos: ', err);
            setGrupos([]);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (editData) {
                console.log(formData, editData);
                await editGrupo(formData, editData.id);
            } else {
                await createGrupo(formData);
            }
            setIsModalOpen(false);
            setEditData(null);
            fetchGrupos();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (grupo) => {
        setModalTitle('Editar Grupo');
        setEditData(grupo);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        setDeleteData(id);
    };

    const handleConfirmDelete = async () => {
        if (!deleteData) return;
        try {
            await deleteGrupo(deleteData);
            fetchGrupos();
        } catch (err) {
            console.error(err);
        } finally {
            setDeleteData(null);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between w-full mb-2 border-b border-border-primary">
                <div>
                    <h1 className="text-text-primary text-3xl font-extrabold">Gestión de Grupos</h1>
                    <p className="text-text-tertiary m-2">
                        Gestiona tus grupos, crea, modifica y revisa tus grupos y las materias
                        asociadas a ellos.
                    </p>
                </div>
                <Button
                    onClick={() => {
                        (setIsModalOpen(true), setModalTitle('Nuevo Grupo'));
                    }}
                    variant="primary"
                >
                    Agregar Grupo
                </Button>
            </div>

            <Table
                columns={columns}
                data={grupos}
                renderActions={(grupo) => (
                    <>
                        <Button
                            title="Gestionar Materias del Grupo"
                            onClick={() => {
                                setGrupoMaterias(grupo);
                                setModalSubjects(true);
                                setModalTitle(`Gestión de Materias - ${grupo.nombre}`);
                            }}
                            variant="secondary"
                            icon={HiOutlineBookOpen}
                        ></Button>
                        <Button
                            title="editar"
                            onClick={() => handleEdit(grupo)}
                            variant="primary"
                            icon={HiOutlinePencil}
                        ></Button>
                        <Button
                            title="eliminar"
                            onClick={() => {
                                handleDelete(grupo.id);
                            }}
                            variant="danger"
                            icon={HiTrash}
                        ></Button>
                    </>
                )}
            ></Table>

            <Modal
                title={modalTitle}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditData(null);
                }}
            >
                <Form
                    fields={formFields}
                    initialData={editData || {}}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setEditData(null);
                    }}
                ></Form>
            </Modal>

            <Modal
                title="Confirmar Eliminación"
                isOpen={deleteData != null}
                onClose={() => setDeleteData(null)}
            >
                <div className="flex flex-col gap-6 p-2">
                    <div>
                        <br />
                        <p>¿Estás seguro de eliminar este grupo?</p>
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

            <Modal
                title={modalTitle}
                isOpen={modalSubjects}
                onClose={() => {
                    setGrupoMaterias(null);
                    setModalSubjects(false);
                }}
                size="xl"
            >
                {grupoMaterias && (
                    <SubjectManager grupoId={grupoMaterias.id} nombreGrupo={grupoMaterias.nombre} />
                )}
            </Modal>
        </div>
    );
};

export default GruposPage;
