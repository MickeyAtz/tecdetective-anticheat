import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importación de páginas
import LoginPage from '@/pages/LoginPage.jsx';
import RegisterPage from '@/pages/RegisterPage.jsx';
import DashboardPage from '@/pages/DashboardPage.jsx';
import ExamenPage from '@/pages/ExamenPage.jsx';
import GruposPage from '@/pages/GruposPage';

// Importacion de layouts
import AuthLayout from '@/components/templates/AuthLayout.jsx';
import MainLayout from '@/components/templates/MainLayout.jsx';

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
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="examenes" element={<ExamenPage />} />
                    <Route path="grupos" element={<GruposPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
