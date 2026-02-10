import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// Importación de hooks y apis
import useAuth from '@/hooks/useAuth';
import axios from '@/api/axios.js';

// Importación de componentes
import Input from '@/components/atoms/Input.jsx';
import Button from '@/components/atoms/Button.jsx';
import Alerta from '@/components/atoms/Alerta.jsx';

const RegisterPage = () => {
    // Definicion de estados (React)
    const [dataForm, setDataForm] = useState({
        nombre: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    useEffect(() => {
        if (auth?.accessToken) {
            navigate(from, { replace: true });
        }
    }, [auth, navigate, from]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setError('');
        setDataForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Definición del handleSubmit (form)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Verificación de contraseñas
        if (dataForm.password !== dataForm.confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        try {
            // Registro del profesor mediante POST:api/auth/profesor
            const response = await axios.post('/auth/profesor', JSON.stringify(dataForm), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });

            // Si el resultado es 201 (creado correctamente), se logea mediante el endpoint de login
            if (response?.status === 201) {
                const responseLogin = await axios.post(
                    '/auth/login',
                    JSON.stringify({ email: dataForm.email, password: dataForm.password }),
                    {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: true,
                    }
                );

                const accessToken = responseLogin?.data?.accessTokens;

                setAuth({
                    email: responseLogin?.data?.email,
                    accessToken,
                    nombre: responseLogin?.data?.nombre,
                });

                // Navegación al dashboard / pagina principal
                navigate(from, { replace: true });
            }
        } catch (error) {
            if (!error?.response) {
                setError('Servidor sin respuseta.');
            } else if (error.response?.status === 409) {
                setError('El correo ya se encuentra en uso.');
            } else {
                setError('Error al dar de alta.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h2>Registrar nuevo usuario</h2>
                {error && <Alerta type={error}>{error}</Alerta>}

                <Input
                    type="text"
                    label="Nombre Completo"
                    name="nombre"
                    placeholder="Ingresa tu nombre completo"
                    value={dataForm.nombre}
                    onChange={handleChange}
                    required
                />
                <Input
                    type="email"
                    label="Correo Electrónico"
                    name="email"
                    placeholder="Ingresa tu correo electrónico"
                    value={dataForm.email}
                    onChange={handleChange}
                    autoComplete="username"
                    required
                />
                <Input
                    type="password"
                    label="Contraseña"
                    name="password"
                    placeholder="Ingresa una contraseña"
                    value={dataForm.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                />
                <Input
                    type="password"
                    label="Confirmar contraseña"
                    name="confirmPassword"
                    placeholder="Confirma la contraseña"
                    value={dataForm.confirmPassword}
                    onChange={handleChange}
                    autoComplete="confirm-password"
                    required
                />
                <div className="flex justify-end ">
                    <Button size="lg">{isLoading ? 'Registrando...' : 'Registrar'}</Button>
                </div>
            </form>
        </>
    );
};

export default RegisterPage;
