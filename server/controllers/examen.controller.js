import pool from '../db.js';

//TODO: Creacion de controladores para el examen
export const validarExamen = async (req, res) => {
    const { nControl, nombre, claveExamen } = req.body;

    try {
        const response = await pool.query(
            "SELECT * FROM examenes WHERE clave = $1 AND estado = 'activo'",
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
                .json({ message: 'No existe el examen o esta inactivo.', ok: false });
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
