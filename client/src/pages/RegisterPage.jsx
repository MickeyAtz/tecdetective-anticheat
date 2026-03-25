import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Importación de hooks y apis
import axiosInstance from '@/api/axiosInstance.js';
import { useUser } from '@/context/UserContext.jsx';

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

    const navigate = useNavigate();
    const { user, setUser } = useUser();

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
            const response = await axiosInstance.post('/auth/profesor', JSON.stringify(dataForm));

            // Si el resultado es 201 (creado correctamente), se logea mediante el endpoint de login
            if (response?.status === 201) {
                const responseLogin = await axiosInstance.post(
                    '/auth/login',
                    JSON.stringify({ email: dataForm.email, password: dataForm.password })
                );

                // Recuperación y asignación de usuario y token
                const token = responseLogin?.data?.token;
                const user = responseLogin?.data?.user;

                setUser(user);
                localStorage.setItem('token', token);

                // Navegación al dashboard / pagina principal
                navigate('/', { replace: true });
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
