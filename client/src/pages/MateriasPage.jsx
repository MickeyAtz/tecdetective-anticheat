import React, { useState, useEffect } from 'react';

import { getMaterias, createMateria, modifyMateria, deleteMateria } from '@/api/materias.api.js';

import Table from '@/components/organism/Table.jsx';
import Card from '@/components/molecules/Card.jsx';
import Button from '@/components/atoms/Button.jsx';
import Modal from '@/components/atoms/Modal.jsx';
import Form from '@/components/molecules/Form.jsx';
import Alerta from '@/components/atoms/Alerta.jsx';

import { HiTrash, HiOutlinePencil } from 'react-icons/hi';

const columns = [
    { field: 'nombre', label: 'Nombre' },
    { field: 'creado_at', label: 'Fecha de creación' },
];

const formFields = [
    {
        name: 'nombre',
        label: 'Nombre de la Materia',
        type: 'text',
        placeholder: 'Ej. Taller de Programación II',
    },
];

const MateriasPage = () => {
    const [materias, setMaterias] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');

    const [editData, setEditData] = useState(null);
    const [deleteData, setDeleteData] = useState(null);

    useEffect(() => {
        fetchMaterias();
    }, []);

    const fetchMaterias = async () => {
        try {
            const { materias } = await getMaterias();
            const formatedMateria = materias.map((materia) => ({
                ...materia,
                creado_at: new Date(materia.creado_at).toLocaleDateString('es-MX'),
            }));
            setMaterias(formatedMateria);
        } catch (err) {
            setMaterias([]);
        }
    };

    //
    const handleSubmit = async (formData) => {
        try {
            if (editData) {
                await modifyMateria(formData, editData.id);
            } else {
                console.log(formData);
                await createMateria(formData);
            }
            fetchMaterias();
        } catch (err) {
            console.error(err);
        } finally {
            setEditData(null);
            setIsModalOpen(false);
            console.log('123');
        }
    };

    const handleEdit = (materia) => {
        setModalTitle('Editar Materia');
        setEditData(materia);
        setIsModalOpen(true);
    };

    const handleDelete = (materia) => {
        setDeleteData(materia);
    };

    const handleConfirmDelete = async () => {
        if (!deleteData) return;
        try {
            await deleteMateria(deleteData.id);
            fetchMaterias();
        } catch (err) {
            console.error(err);
        } finally {
            setDeleteData(null);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between w-full mb-2 border-b border-border-primary gap-y-4 ">
                <div>
                    <h1 className="text-3xl font-extrabold text-text-primary">
                        Gestión de Materias
                    </h1>
                    <p className="text-text-tertiary mt-2 mb-2">
                        Gestiona las materias, crea, modifica y revisa tus materias.
                    </p>
                </div>
                <Button
                    onClick={() => {
                        setIsModalOpen(true);
                        setModalTitle('Nueva Materia');
                    }}
                >
                    Agregar Materia
                </Button>
            </div>
            <Table
                columns={columns}
                data={materias}
                renderActions={(materia) => (
                    <>
                        <Button
                            title="editar"
                            onClick={() => handleEdit(materia)}
                            icon={HiOutlinePencil}
                        />
                        <Button
                            title="eliminar"
                            variant="danger"
                            onClick={() => handleDelete(materia)}
                            icon={HiTrash}
                        />
                    </>
                )}
            ></Table>
            <Modal
                title={modalTitle}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setModalTitle('');
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
                        setModalTitle('');
                    }}
                />
            </Modal>

            <Modal
                title="Confirmar Eliminación"
                isOpen={deleteData != null}
                onClose={() => setDeleteData(null)}
            >
                <div className="flex flex-col gap-6 p-2">
                    <div>
                        <br />
                        <p>¿Estás seguro de eliminar esta materia?</p>
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

export default MateriasPage;
