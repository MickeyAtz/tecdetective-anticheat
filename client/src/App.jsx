import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importación de páginas
import LoginPage from '@/pages/LoginPage.jsx';
import RegisterPage from '@/pages/RegisterPage.jsx';
import DashboardPage from '@/pages/DashboardPage.jsx';
import ExamenPage from '@/pages/ExamenPage.jsx';
import GruposPage from '@/pages/GruposPage.jsx';
import MateriasPage from '@/pages/MateriasPage.jsx';
import ExamenHistorial from '@/pages/ExamenHistorial.jsx';
import ExamenMonitorPage from '@/pages/ExamenMonitorPage.jsx';
import ExamenLobbyPage from '@/pages/ExamenLobbyPage.jsx';
// Contextos
import { useUser } from '@/context/UserContext.jsx';
import { SocketProvider } from '@/context/SocketContext.jsx';

import MockPage from '@/pages/MockPage.jsx';

// Importacion de layouts
import AuthLayout from '@/components/templates/AuthLayout.jsx';
import MainLayout from '@/components/templates/MainLayout.jsx';

function App() {
    const { token } = useUser();
    return (
        <BrowserRouter>
            <Routes>
                {/* --- RUTAS PÚBLICAS --- */}
                <Route path="/auth" element={<AuthLayout />}>
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                </Route>

                {/* --- RUTAS PRIVADAS (Con persistencia y seguridad) --- */}
                <Route
                    path="/"
                    element={token ? <MainLayout /> : <Navigate to="/auth/login" replace />}
                >
                    <Route index element={<DashboardPage />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="examenes/" element={<ExamenPage />} />
                    <Route path="examen/">
                        <Route element={<SocketProvider />}>
                            <Route path="lobby/:id" element={<ExamenLobbyPage />} />
                            <Route path="monitor/:id" element={<ExamenMonitorPage />} />
                        </Route>
                        <Route path="resultados/:id" element={<ExamenHistorial />} />
                    </Route>

                    <Route path="gestion/">
                        <Route path="grupos" element={<GruposPage />} />
                        <Route path="materias" element={<MateriasPage />} />
                    </Route>
                    <Route path="pruebas" element={<MockPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
