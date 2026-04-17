import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import Card from '@/components/molecules/Card.jsx';
import Table from '@/components/organism/Table.jsx';
import Button from '@/components/atoms/Button.jsx';
import { getDashboardData } from '@/api/dashboard.api.js';

const DashboardPage = () => {
    const [data, setData] = useState({ summary: {}, trend: [], upcoming: [], recent: [] });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const dashboardData = await getDashboardData();
                setData(dashboardData);
            } catch (error) {
                console.error('Error al cargar los datos del dashboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const upcomingColumns = [
        { label: 'Examen', field: 'name' },
        { label: 'Materia', field: 'subject' },
        { label: 'Fecha', field: 'start_date' },
    ];

    const recentColumns = [
        { label: 'Examen', field: 'name' },
        { label: 'Alertas', field: 'incident_count' },
        { label: 'Fecha', field: 'end_date' },
    ];

    const formatDateStr = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
    };

    if (loading) return <div className="p-6 text-text-primary">Cargando panel...</div>;

    return (
        <div className="p-6 space-y-6 bg-bg-primary min-h-screen">
            <h1 className="text-2xl font-bold text-text-primary">Panel de Control</h1>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Integridad del Grupo" subtitle="Promedio de alertas por examen">
                    <span className="text-4xl font-bold text-brand-primary">
                        {data.summary?.avg_incidents || 0}
                    </span>
                </Card>
                <Card title="Alertas del Mes" subtitle="Total acumulado (30 días)">
                    <span className="text-4xl font-bold text-status-warning">
                        {data.summary?.total_incidents || 0}
                    </span>
                </Card>
            </div>

            {/* Gráfica de Tendencia */}
            <Card title="Tendencia de Incidencias" subtitle="Histórico de los últimos 15 días">
                <div className="h-64 w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.trend}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="var(--color-border-primary)"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="date"
                                tickFormatter={formatDateStr}
                                stroke="var(--color-text-tertiary)"
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis stroke="var(--color-text-tertiary)" tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--color-bg-secondary)',
                                    borderColor: 'var(--color-border-primary)',
                                    color: 'var(--color-text-primary)',
                                    borderRadius: '8px',
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="count"
                                name="Alertas"
                                stroke="var(--color-brand-primary)"
                                strokeWidth={3}
                                dot={{ r: 4, fill: 'var(--color-brand-primary)' }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Tablas */}
            <div className="grid grid-cols-1 gap-6">
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-text-primary">Próximas Sesiones</h2>
                    <Table
                        columns={upcomingColumns}
                        data={data.upcoming}
                        renderCell={(row, field) =>
                            field.includes('date')
                                ? new Date(row[field]).toLocaleString('es-MX')
                                : row[field]
                        }
                        renderActions={(row) => (
                            <Button size="sm" onClick={() => navigate(`/examen/lobby/${row.id}`)}>
                                Preparar
                            </Button>
                        )}
                        paginacion={false}
                        busqueda={false}
                    />
                </div>
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-text-primary">Historial Reciente</h2>
                    <Table
                        columns={recentColumns}
                        data={data.recent}
                        renderCell={(row, field) =>
                            field.includes('date')
                                ? new Date(row[field]).toLocaleDateString('es-MX')
                                : row[field]
                        }
                        renderActions={(row) => (
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => navigate(`/examen/resultados/${row.id}`)}
                            >
                                Reporte
                            </Button>
                        )}
                        paginacion={false}
                        busqueda={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
