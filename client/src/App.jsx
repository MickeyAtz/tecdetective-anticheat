import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importacion de componentes
import Button from '@/components/atoms/Button.jsx';
import Form from '@/components/molecules/Form';
import Badge from '@/components/atoms/Badge.jsx';
import StudentList from '@/components/molecules/StudentList.jsx';
import Card from '@/components/molecules/Card';
import Modal from '@/components/atoms/Modal';
import MainLayout from '@/components/templates/MainLayout';
import AuthLayout from '@/components/templates/AuthLayout';
// Importacion de mocks (test cases)
import { STUDENTS_MOCK } from '@/mocks/students';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas de autenticacion*/}
                <Route path="/auth" element={<AuthLayout />}>
                    {/*
                    //TODO creacion de paginas de Login y Register
                    <Route path='login' element = {<LoginPage></LoginPage>}></Route>
                    <Route path='register' element = {<RegisterPage></RegisterPage>}></Route>
                */}
                </Route>
                {/* Area de la aplicacion (RUTAS PRIVADAS)*/}
                <Route path="/" element={<MainLayout />}>
                    {/*// TODO creacion de paginas y agregarlas al router de react */}
                    <Route
                        index
                        element={
                            <StudentList students={STUDENTS_MOCK}></StudentList>
                        }
                    ></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
