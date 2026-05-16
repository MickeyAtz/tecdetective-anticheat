import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
//Importacion de componentes
import Navbar from '@/components/molecules/Navbar.jsx';
import Modal from '@/components/atoms/Modal.jsx';
import Input from '@/components/atoms/Input.jsx';
import Button from '@/components/atoms/Button.jsx';
import { useUser } from '@/context/UserContext';

import { editProfesor, editPassword } from '@/api/profesores.api';

const MainLayout = () => {
    const { user, setUser } = useUser();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalPasswordOpen, setIsModalPasswordOpen] = useState(false);

    const [dataForm, setDataForm] = useState({
        nombre: user.nombre,
        email: user.email,
    });

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme) {
            return savedTheme === 'dark';
        }

        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle('dark', isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDataForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const actualizarProfesor = async () => {
        try {
            await editProfesor(dataForm);
            toast.success('Información actualizada correctamente');
            setUser(dataForm);
        } catch (err) {
            toast.error('Error al actualizar profesor');
            console.error(err);
        } finally {
            setIsModalOpen(false);
        }
    };

    const actualizarPassword = async () => {
        if (password !== confirmPassword) {
            toast.error('Las contraseñas no coinciden.');
            return;
        }

        try {
            await editPassword({ password });
            toast.success('Contraseña actualizada correctamente.');
        } catch (err) {
            toast.error('Error al actualizar la contraseña');
        } finally {
            setIsModalPasswordOpen(false);
            setPassword('');
            setDataForm({ nombre: '', correo: '' });
        }
    };

    const toggleDarkMode = () => setIsDarkMode((currentTheme) => !currentTheme);

    const layoutStyle = `min-h-screen bg-bg-primary text-text-primary transition-colors duration-300`;
    const containerStyle = `max-w-5xl mx-auto p-4 pt-20`;

    const openModal = () => {
        setIsModalOpen(true);
    };

    const openModalPassword = () => {
        setIsModalPasswordOpen(true);
    };

    return (
        <div className="bg-bg-primary">
            <div className={layoutStyle}>
                <Navbar
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
                    openModal={openModal}
                    openModalPassword={openModalPassword}
                />
                <main className={containerStyle}>
                    <Outlet />
                </main>
                <Toaster position="bottom-right" richColors theme={isDarkMode ? 'dark' : 'light'} />
            </div>
            <Modal
                title="Modificar Perfil"
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
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
                <div className="flex justify-end gap-4">
                    <Button size="lg" onClick={() => setIsModalOpen(false)} variant="danger">
                        Cancelar
                    </Button>
                    <Button size="lg" onClick={actualizarProfesor}>
                        Guardar Cambios
                    </Button>
                </div>
            </Modal>
            <Modal
                title="Cambiar contraseña"
                isOpen={isModalPasswordOpen}
                onClose={() => setIsModalPasswordOpen(false)}
            >
                <Input
                    type="password"
                    label="Nueva contraseña"
                    name="password"
                    placeholder="Ingresa tu nueva contraseña"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    required
                ></Input>

                <Input
                    type="password"
                    label="Confirmar contraseña"
                    name="passwordConfirm"
                    placeholder="Confirmar contraseña"
                    value={confirmPassword}
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                    }}
                    required
                ></Input>
                <div className="flex justify-end gap-4">
                    <Button
                        size="lg"
                        onClick={() => setIsModalPasswordOpen(false)}
                        variant="danger"
                    >
                        Cancelar
                    </Button>
                    <Button size="lg" onClick={actualizarPassword}>
                        Guardar Cambios
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default MainLayout;
