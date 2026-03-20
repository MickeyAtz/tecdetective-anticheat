import pool from '../db.js';

export const validarExamen = async (req, res) => {
    const { nControl, nombre, claveExamen } = req.body;
    console.log(req.body);

    try {
        const response = await pool.query(
            "SELECT * FROM examenes WHERE codigo_acceso = $1 AND estado = 'activo'",
            [claveExamen]
        );

        if (response.rows.length > 0) {
            const idExamen = response.rows[0].id;
            await pool.query(
                'INSERT INTO participantes(examen_id, numero_control, nombre_completo) VALUES($1, $2, $3)',
                [idExamen, nControl, nombre]
            );
            return res.status(200).json({ ok: true, message: 'Bienvenido al examen.' });
        } else
            return res
                .status(401)
                .json({ messa: 'No existe el examen o esta inactivo.', ok: false });
    } catch (error) {
        console.error(error);

        if (error.code === '23505') {
            return res.status(400).json({
                ok: false,
                message: 'Ya estas registrado en este examen.',
            });
        }

        return res.status(500).json({ message: 'Error en el servidor.' });
    }
};

export const createExamen = async (req, res) => {
    const { uid } = req.user;
    const { grupo_id, titulo, codigo_acceso, estado, duracion_minutos, materia_id, programed_at } =
        req.body;

    try {
        const nuevoExamen = await pool.query(
            `
                INSERT INTO examenes
                (grupo_id, titulo, codigo_acceso, estado, duracion_minutos, materia_id, programed_at, profesor_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            `,
            [
                grupo_id,
                titulo,
                codigo_acceso,
                estado,
                duracion_minutos,
                materia_id,
                programed_at,
                uid,
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
    const { uid } = req.user;

    try {
        const result = await pool.query(
            'SELECT * FROM examenes WHERE profesor_id = $1 ORDER BY fecha_programada ASC AND deleted_at IS NULL',
            [uid]
        );

        return res.json(result.rows);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }
};

