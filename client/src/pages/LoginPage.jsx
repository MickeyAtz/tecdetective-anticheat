import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '@/api/axiosInstance.js';
import { useUser } from '@/context/UserContext.jsx';
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
    const { setUser, setToken } = useUser();
    const navigate = useNavigate();

    // Handle change de los
    const handleChange = (e) => {
        const { name, value } = e.target;
        setError('');
        setDataForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Solicitud al backend
            const response = await axiosInstance.post('/auth/login', JSON.stringify(dataForm));

            // Recuperación del Access token
            const token = response?.data?.token;
            // Recuperación del usuario
            const user = response?.data?.user;

            // Asignación del usuario en el hook useUser
            setUser(user);
            setToken(token);

            navigate('/', { replace: true });
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
                ></Input>
                <div className="flex justify-end">
                    <Button type="submit" size="lg" title="Inicio de sesión" disabled={isLoading}>
                        {isLoading ? 'Ingresando...' : 'Ingresar'}
                    </Button>
                </div>
            </form>
        </>
    );
};

export default Login;
