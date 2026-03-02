import React, { useState } from 'react';
import Alerta from '@/components/atoms/Alerta';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Card from '@/components/molecules/Card';
import StudentListItem from '@/components/molecules/StudentListItem';

import { STUDENTS_MOCK } from '@/mocks/students';
import StudentList from '@/components/molecules/StudentList';

const DesignSystemPage = () => {
    const [inputValue, setInputValue] = useState('');
    const [selectValue, setSelectValue] = useState('');

    // Datos de prueba para simular un estudiante con incidentes
    const mockStudent = {
        id: 'st-002',
        nombre: 'Alondra García',
        status: 'success',
        incidents: [
            {
                id: 'inc-1',
                nombre: 'Cambio de pestaña',
                descripcion: 'Se detectó salida del navegador por más de 5 segundos.',
                fechaYHora: '10:15 AM',
            },
        ],
    };

    const options = [
        { value: '1', label: 'Ingeniería en Sistemas' },
        { value: '2', label: 'Licenciatura en Administración' },
        { value: '3', label: 'Ingeniería Industrial' },
    ];

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 space-y-12">
            <header>
                <h1 className="text-3xl font-black text-text-primary mb-2">
                    Catálogo de Componentes
                </h1>
                <p className="text-text-secondary">
                    Pruebas visuales de átomos y moléculas para TecDetective.
                </p>
            </header>

            {/* --- SECCIÓN DE ÁTOMOS --- */}
            <section className="space-y-6">
                <h2 className="text-xl font-bold text-brand-primary border-b border-border-primary pb-2">
                    Átomos
                </h2>

                {/* Alertas */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Alerta type="success">Operación completada con éxito.</Alerta>
                    <Alerta type="error">Se ha producido un error crítico.</Alerta>
                    <Alerta type="info">Hay una nueva notificación disponible.</Alerta>
                </div>

                {/* Botones */}
                <Card title="Botones y Tamaños">
                    <div className="flex flex-wrap gap-4 items-center">
                        <Button variant="primary" size="lg">
                            Primario LG
                        </Button>
                        <Button variant="secondary" size="md">
                            Secundario MD
                        </Button>
                        <Button variant="ghost" size="sm">
                            Ghost SM
                        </Button>
                        <Button variant="primary" disabled>
                            Deshabilitado
                        </Button>
                    </div>
                </Card>

                {/* Form Components */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card title="Inputs">
                        <Input
                            label="Campo de Texto"
                            placeholder="Escribe algo aquí..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <p className="text-xs text-text-tertiary mt-2">
                            Valor actual: {inputValue}
                        </p>
                    </Card>
                    <Card title="Selects">
                        <Select
                            label="Carrera"
                            options={options}
                            value={selectValue}
                            onChange={setSelectValue}
                            placeholder="Selecciona una opción..."
                        />
                    </Card>
                </div>

                {/* Badges */}
                <Card title="Badges">
                    <div className="flex flex-wrap gap-3">
                        <Badge variant="primary">Principal</Badge>
                        <Badge variant="success">Exitoso</Badge>
                        <Badge variant="danger">Peligro</Badge>
                        <Badge variant="warning">Advertencia</Badge>
                        <Badge variant="info">Información</Badge>
                    </div>
                </Card>
            </section>

            {/* --- SECCIÓN DE MOLÉCULAS --- */}
            <section className="space-y-6">
                <h2 className="text-xl font-bold text-brand-primary border-b border-border-primary pb-2">
                    Moléculas
                </h2>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* StudentListItem */}
                    <div>
                        <h3 className="text-sm font-semibold text-text-secondary mb-4 uppercase tracking-widest">
                            Lista de Alumnos
                        </h3>
                        <ul className="space-y-2">
                            <StudentList students={STUDENTS_MOCK}></StudentList>
                        </ul>
                    </div>

                    {/* Card Completa */}
                    <Card
                        title="Detalles de la Sesión"
                        subtitle="Examen Parcial de Redes"
                        footer={
                            <>
                                <Button variant="ghost" size="sm">
                                    Cerrar
                                </Button>
                                <Button variant="primary" size="sm">
                                    Actualizar
                                </Button>
                            </>
                        }
                    >
                        <p>
                            Este es un ejemplo de cómo se visualiza el cuerpo de la tarjeta con su
                            pie de página alineado a la derecha.
                        </p>
                    </Card>
                </div>
            </section>
        </div>
    );
};

export default DesignSystemPage;
