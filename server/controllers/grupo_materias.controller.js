import pool from '../db.js';

export const asignarMateria = async (req, res) => {
    const { idMateria, idGrupo } = req.params;

    try {
        await pool.query('INSERT INTO materia_grupo(materia_id, grupo_id) VALUES($1, $2)', [
            idMateria,
            idGrupo,
        ]);
        return res.status(201).json({ message: 'Materia asignada correctamente.' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }
};

export const quitarAsignacionMateria = async (req, res) => {
    const { idMateria, idGrupo } = req.params;

    try {
        await pool.query('DELETE FROM materia_grupo WHERE grupo_id = $1 AND materia_id = $2', [
            idGrupo,
            idMateria,
        ]);

        return res.status(200).json({ message: 'Asignación eliminada correctamente.' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }
};

export const getMateriasAsignadas = async (req, res) => {
    const { idGrupo } = req.params;

    try {
        const result = await pool.query(
            `
            SELECT 
                m.id,
                m.nombre,
                m.profesor_id
            FROM materias m
            INNER JOIN materia_grupo mg
            ON mg.materia_id = m.id
            WHERE mg.grupo_id = $1
                AND m.deleted_at IS NULL
            `,
            [idGrupo]
        );
        return res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }
};

export const getMateriasDisponibles = async (req, res) => {
    const { idGrupo } = req.params;
    try {
        const materias = await pool.query(
            `
                SELECT * FROM materias
                WHERE deleted_at IS NULL
                    AND id NOT IN (
                        SELECT materia_id FROM materia_grupo WHERE grupo_id = $1
                    )
            `,
            [idGrupo]
        );
        return res.status(200).json(materias.rows);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }
};
