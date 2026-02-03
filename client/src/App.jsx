import { useState } from 'react';
import Button from '@/components/atoms/Button.jsx';
import Form from './components/molecules/Form';
import Badge from '@/components/atoms/Badge.jsx';
function App() {
    const fields = [
        {
            name: 'nombre',
            label: 'Nombre',
            type: 'text',
            placeholder: 'Juan',
            onInput: (e) => {
                e.target.value = e.target.value.replace(
                    /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g,
                    ''
                );
            },
            minLength: 2,
            maxLenth: 50,
        },
        {
            name: 'apellidos',
            label: 'Apellidos',
            type: 'text',
            placeholder: 'Pérez',
            onInput: (e) => {
                e.target.value = e.target.value.replace(
                    /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g,
                    ''
                );
            },
            minLength: 2,
            maxLenth: 50,
        },
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            placeholder: 'correo@ejemplo.com',
            minLength: 2,
            maxLenth: 50,
        },
        {
            name: 'telefono',
            label: 'Teléfono',
            type: 'tel',
            placeholder: '5551234567',
            maxLength: 10,
            title: 'Debe ser un número de 10 dígitos',
            required: true,
            onInput: (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            },
        },
        {
            name: 'password',
            label: 'Contraseña',
            type: 'password',
            placeholder: '********',
        },
    ];

    return (
        <>
            <Form fields={fields}></Form>
            <Badge>Esta es una badge</Badge>
        </>
    );
}

export default App;
