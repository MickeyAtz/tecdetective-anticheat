import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importación de páginas
import LoginPage from '@/pages/LoginPage.jsx';

// Importacion de layouts
import AuthLayout from '@/components/templates/AuthLayout.jsx';
import MainLayout from '@/components/templates/MainLayout.jsx';

// Importacion de mocks (test cases)
import { STUDENTS_MOCK } from '@/mocks/students';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas de autenticacion*/}
                <Route path="/auth" element={<AuthLayout />}>
                    <Route path="/auth/login" element={<LoginPage></LoginPage>}></Route>
                    {/* <Route path='register' element = {<RegisterPage></RegisterPage>}></Route> */}
                </Route>
                {/* Area de la aplicacion (RUTAS PRIVADAS)*/}
                <Route path="/" element={<MainLayout />}>
                    {/*// TODO creacion de paginas y agregarlas al router de react */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
