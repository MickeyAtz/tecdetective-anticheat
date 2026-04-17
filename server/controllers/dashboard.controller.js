import pool from '../db.js';

export const getDashboardData = async (req, res) => {
    const { id } = req.user;

    try {
        const summaryQuery = `
            SELECT 
                (SELECT COUNT(li.id) 
                 FROM logs_incidentes li
                 INNER JOIN participantes p ON li.participante_id = p.id
                 INNER JOIN examenes e ON p.examen_id = e.id
                 WHERE e.profesor_id = $1 AND li.creado_at > NOW() - INTERVAL '30 days'
                ) as total_incidents,
                
                (SELECT COALESCE(ROUND(AVG(incident_count), 2), 0) FROM (
                    SELECT COUNT(li.id) as incident_count
                    FROM examenes e
                    LEFT JOIN participantes p ON e.id = p.examen_id
                    LEFT JOIN logs_incidentes li ON p.id = li.participante_id
                    WHERE e.profesor_id = $1 AND e.estado = 'FINALIZADO'
                    GROUP BY e.id
                ) AS exam_incidents) as avg_incidents
        `;

        const trendQuery = `
            SELECT DATE(li.creado_at) as date, COUNT(li.id) as count
            FROM logs_incidentes li
            INNER JOIN participantes p ON li.participante_id = p.id
            INNER JOIN examenes e ON p.examen_id = e.id
            WHERE e.profesor_id = $1 AND li.creado_at > NOW() - INTERVAL '15 days'
            GROUP BY DATE(li.creado_at)
            ORDER BY DATE(li.creado_at) ASC
        `;

        const upcomingQuery = `
            SELECT e.id, e.titulo as name, m.nombre as subject, e.programed_at as start_date 
            FROM examenes e
            LEFT JOIN materias m ON e.materia_id = m.id
            WHERE e.profesor_id = $1 AND e.estado = 'PENDIENTE'
            ORDER BY e.programed_at ASC 
            LIMIT 3
        `;

        const recentQuery = `
            SELECT e.id, e.titulo as name, e.programed_at as end_date, COUNT(li.id) as incident_count
            FROM examenes e
            LEFT JOIN participantes p ON e.id = p.examen_id
            LEFT JOIN logs_incidentes li ON p.id = li.participante_id
            WHERE e.profesor_id = $1 AND e.estado = 'FINALIZADO'
            GROUP BY e.id, e.titulo, e.programed_at
            ORDER BY e.programed_at DESC
            LIMIT 5
        `;

        const [summary, trend, upcoming, recent] = await Promise.all([
            pool.query(summaryQuery, [id]),
            pool.query(trendQuery, [id]),
            pool.query(upcomingQuery, [id]),
            pool.query(recentQuery, [id]),
        ]);

        res.json({
            summary: summary.rows[0] ? summary.rows[0] : { total_incidents: 0, avg_incidents: 0 },
            trend: trend.rows,
            upcoming: upcoming.rows,
            recent: recent.rows,
        });
    } catch (err) {
        console.error('Error en getDashboardData:', err);
        return res.status(500).send({ message: 'Error al obtener los datos del servidor.' });
    }
};
