import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/atoms/Button.jsx';
import Input from '@/components/atoms/Input.jsx';

const Login = () => {
    const navigate = useNavigate();
    const [dataForm, setDataForm] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDataForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(dataForm);
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setIsSaving(true);
    //     setIsLoading(true);
    //     setError('');

    //     const payload = { ...formData };

    //     try {
    //     } catch (error) {
    //         setError('Error al iniciar sesión. Por favor, intenta de nuevo.');
    //         console.error(error);
    //     } finally {
    //         setIsSaving(false);
    //         setIsLoading(false);
    //     }
    // };

    // Definicion de estilos de la paagina
    const errorStyle = '';

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h2>Inicio de sesión</h2>
                <br />
                {error && <p className={errorStyle}>{error}</p>}

                <Input
                    name="email"
                    label="Correo Electrónico"
                    type="email"
                    placeholder="Ingresa tu correo electrónico"
                    value={dataForm.email}
                    onChange={handleChange}
                    autoComplete="correo-electronico"
                    required
                ></Input>
                <Input
                    name="password"
                    label="Contraseña"
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    value={dataForm.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                ></Input>
                <Button type="submit" size="lg" title="Inicio de sesión" disabled={isLoading}>
                    {isLoading ? 'Ingresando...' : 'Ingresar'}
                </Button>
            </form>
        </>
    );
};

export default Login;
