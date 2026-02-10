import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '@/api/axios.js';
import useAuth from '@/hooks/useAuth.js';

// Importacion de componentes
import Button from '@/components/atoms/Button.jsx';
import Input from '@/components/atoms/Input.jsx';
import Alerta from '@/components/atoms/Alerta.jsx';

const Login = () => {
    // Estados
    const [dataForm, setDataForm] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // hooks
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';
    // Handle change de los
    const handleChange = (e) => {
        const { name, value } = e.target;
        setError('');
        setDataForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Redireccionamiento cuanto se inicia sesión
    useEffect(() => {
        console.log('Redireccionando...');
        if (auth?.accessToken) {
            navigate(from, { replace: true });
        }
    }, [auth, navigate, from]);

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Solicitud al backend
            const response = await axios.post('/auth/login', JSON.stringify(dataForm), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });

            // Access token
            const accessToken = response?.data?.accessToken;

            // Alimentamos el contex de react (authContext)
            setAuth({ email: dataForm.email, accessToken, nombre: response?.data?.nombre });

            navigate(from, { replace: true });
        } catch (error) {
            if (!error?.response) {
                setError('Servidor sin respuesta.');
            } else if (error.response?.status === 401) {
                setError('Usuario o contraseña incorrectos.');
            } else {
                setError('Error en el inicio de sesión.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h2>Inicio de sesión</h2>
                {error && <Alerta type="error">{error}</Alerta>}

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
