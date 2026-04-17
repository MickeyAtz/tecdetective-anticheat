import pool from '../db.js';

export const validarExamen = async (req, res) => {
    const { nControl, nombre, claveExamen } = req.body;

    try {
        // Validacion del examen.
        const response = await pool.query(
            "SELECT * FROM examenes WHERE codigo_acceso = $1 AND estado IN ('ESPERA', 'ACTIVO')",
            [claveExamen]
        );

        if (response.rows.length === 0) {
            return res
                .status(401)
                .json({ message: 'No existe el examen o esta inactivo.', ok: false });
        }

        const idReal = response.rows[0].id;

        // Insercion del participante
        try {
            const result = await pool.query(
                'INSERT INTO participantes(examen_id, numero_control, nombre_completo) VALUES($1, $2, $3) RETURNING *',
                [idReal, nControl, nombre]
            );
            console.log(result.rows[0]);

            return res.status(200).json({
                ok: true,
                idExamen: idReal,
                message: 'Bienvenido al examen',
                idParticipante: result.rows[0].id,
            });
            // Manejo de errores por unicidad (PostgreSQL)
        } catch (dbError) {
            if (dbError.code === '23505') {
                const result = await pool.query(
                    `
                        SELECT p.id FROM participantes p 
                        LEFT JOIN examenes e
                            ON p.examen_id = e.id
                        WHERE p.examen_id = $1
                        AND numero_control = $2
                    `,
                    [idReal, nControl]
                );
                console.log(result.rows[0]);
                return res.status(200).json({
                    ok: true,
                    idExamen: idReal,
                    idParticipante: result.rows[0].id,
                    message: 'Reconexion exitosa. Bienvenido de vuelta',
                });
            }
            throw dbError;
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }
};

export const validarExamen2 = async (req, res) => {
    const { nControl, nombre, claveExamen } = req.body;

    if (!nControl || !nombre || !claveExamen) {
        return res.status(400).json({
            ok: false,
            message: 'Datos incompletos',
        });
    }

    try {
        // Validacion de Examen
        const examResponse = await pool.query(
            `SELECT id FROM examenes 
             WHERE codigo_acceso = $1 
             AND estado IN ('ESPERA', 'ACTIVO')`,
            [claveExamen]
        );

        if (examResponse.rows.length === 0) {
            return res.status(401).json({
                ok: false,
                message: 'No existe el examen o está inactivo.',
            });
        }

        const idExamen = examResponse.rows[0].id;

        // Insercion del participante
        const result = await pool.query(
            `
            INSERT INTO participantes (examen_id, numero_control, nombre_completo)
            VALUES ($1, $2, $3)
            ON CONFLICT (examen_id, numero_control)
            DO UPDATE SET nombre_completo = EXCLUDED.nombre_completo
            RETURNING id;
            `,
            [idExamen, nControl, nombre]
        );

        return res.status(200).json({
            ok: true,
            idExamen,
            idParticipante: result.rows[0].id,
            message: 'Bienvenido al examen',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: 'Error en el servidor.',
        });
    }
};

export const createExamen = async (req, res) => {
    const { id } = req.user;
    const { grupo_id, titulo, codigo_acceso, estado, duracion_minutos, materia_id, programed_at } =
        req.body;

    try {
        const nuevoExamen = await pool.query(
            `
                INSERT INTO examenes
                (grupo_id, titulo, codigo_acceso, estado, duracion_minutos, materia_id, programed_at, profesor_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *
            `,
            [
                grupo_id,
                titulo,
                codigo_acceso,
                estado,
                duracion_minutos,
                materia_id,
                programed_at,
                id,
            ]
        );

        return res
            .status(201)
            .json({ examen: nuevoExamen.rows[0], message: 'Examen creado con exito.' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }
};

export const obtenerExamenes = async (req, res) => {
    const { id } = req.user;

    try {
        const result = await pool.query(
            `
            SELECT * FROM vista_examenes_detalles
            WHERE profesor_id = $1
            AND deleted_at IS NULL
            ORDER BY programed_at ASC
            `,
            [id]
        );

        return res.json(result.rows);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }
};

export const obtenerExamenPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `
                SELECT * FROM vista_examenes_detalles
                WHERE id = $1
            `,
            [id]
        );
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        } else {
            return res.status(404).json({ message: 'No se encontró el examen.' });
        }
    } catch (error) {
        console.error('Error en el servidor.', error);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }
};

export const actualizarExamen = async (req, res) => {
    const { id } = req.params;
    const { titulo, codigo_acceso, duracion_minutos, materia_id, programed_at } = req.body;

    try {
        const result = await pool.query(
            `
                UPDATE examenes 
                SET titulo = $1, codigo_acceso = $2, duracion_minutos = $3, materia_id = $4, programed_at = $5
                WHERE id = $6 AND estado = 'PENDIENTE'
            `,
            [titulo, codigo_acceso, duracion_minutos, materia_id, programed_at, id]
        );

        if (result.rowCount === 0) {
            return res.status(400).json({
                message: 'No se pudo actualizar. El examen no existe o ya comenzó.',
            });
        }

        return res.status(200).json({ message: 'Examen actualizado correctamente.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }
};

export const eliminarExamen = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query(
            `
                UPDATE examenes SET deleted_at = NOW() WHERE id = $1
            `,
            [id]
        );
        return res.status(200).json({ message: 'Examen eliminado correctamente.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }
};

export const cambiarEstadoExamen = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosPermitidos = ['PENDIENTE', 'ESPERA', 'ACTIVO', 'FINALIZADO'];

    if (!estadosPermitidos.includes(estado)) {
        return res.status(400).json({ message: 'Estado no valido' });
    }

    try {
        const result = await pool.query(
            `
                UPDATE examenes
                SET estado = $1
                WHERE id = $2
                RETURNING *
            `,
            [estado, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'No se encontro el examen.' });
        }

        const io = req.app.get('socketio');
        const codigo_sala = result.rows[0].codigo_acceso;

        if (io) {
            if (estado === 'ACTIVO') {
                io.to(codigo_sala).emit('orden_inicio_examen');
            } else if (estado === 'FINALIZADO') {
                io.to(codigo_sala).emit('orden_fin_examen');
            }
        }

        return res.status(200).json({
            message: `El examen ahora está en estado: ${estado}`,
            examen: result.rows[0],
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }
};

export const getHistorialExamen = async (req, res) => {
    const { id } = req.params;

    try {
        const [examenResponse, participantesResponse] = await Promise.all([
            pool.query('SELECT * FROM vista_examenes_detalles WHERE id = $1', [id]),

            pool.query(
                `
                SELECT 
                    p.id,
                    p.numero_control AS "nControl",
                    MAX(p.nombre_completo) AS nombre,
                    COALESCE(
                        json_agg(
                            json_build_object(
                                'id', li.id,
                                'tipo', li.tipo_evento,
                                'detalle', li.descripcion,
                                'hora', li.creado_at
                            )
                        ) FILTER (WHERE li.id IS NOT NULL),
                        '[]'
                    ) AS incidentes
                FROM participantes p
                LEFT JOIN logs_incidentes li 
                    ON li.participante_id = p.id
                WHERE p.examen_id = $1
                GROUP BY p.id, p.numero_control
                ORDER BY nombre ASC
                `,
                [id]
            ),
        ]);

        return res.status(200).json({
            examenResult: examenResponse.rows[0],
            participantesResult: participantesResponse.rows,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }
};

export const getParticipantesEIncidentesByExamen = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `
            SELECT 
            p.numero_control AS "nControl",
            MAX(p.nombre_completo) AS nombre,
            COALESCE(
                json_agg(
                    json_build_object(
                        'id', li.id,
                        'tipo', li.tipo_evento,
                        'detalle', li.descripcion,
                        'hora', li.creado_at
                    )
                ) FILTER (WHERE li.id IS NOT NULL),
                '[]'
            ) AS incidentes
            FROM participantes p
            LEFT JOIN logs_incidentes li 
                ON li.participante_id = p.id
            WHERE p.examen_id = $1
            GROUP BY p.numero_control;
            `,
            [id]
        );
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }
};
