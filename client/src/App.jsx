import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importación de páginas
import LoginPage from '@/pages/LoginPage.jsx';
import RegisterPage from '@/pages/RegisterPage.jsx';

// Importacion de layouts
import AuthLayout from '@/components/templates/AuthLayout.jsx';
import MainLayout from '@/components/templates/MainLayout.jsx';

// Importacion de la capa de seguridad
import PersistLogin from '@/components/auth/PersistLogin.jsx';

// Importacion de mocks (test cases)
import { STUDENTS_MOCK } from '@/mocks/students';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* --- RUTAS PÚBLICAS --- */}
                <Route path="/auth" element={<AuthLayout />}>
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                </Route>

                {/* --- RUTAS PRIVADAS (Con persistencia y seguridad) --- */}
                <Route element={<PersistLogin />}>
                    <Route path="/" element={<MainLayout />}></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
