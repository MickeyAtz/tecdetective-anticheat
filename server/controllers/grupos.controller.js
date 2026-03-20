import pool from '../db.js';

// Creacion del grupo
export const createGrupo = async (req, res) => {
    const { id } = req.user;
    const { nombre, ciclo_escolar } = req.body;

    try {
        const existGrupo = await pool.query(
            'SELECT * FROM grupos WHERE nombre = $1 AND profesor_id = $2 AND deleted_at IS NULL',
            [nombre, id]
        );

        if (existGrupo.rows.length > 0)
            return res.status(401).json({ message: 'Ya existe un grupo con ese nombre.' });

        await pool.query(
            'INSERT INTO grupos(profesor_id, nombre, ciclo_escolar) VALUES($1, $2, $3)',
            [id, nombre, ciclo_escolar]
        );

        return res.status(201).json({ message: 'Grupo creado exitosamente.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor.', error });
    }
};

// Editar grupo
export const modifyGrupo = async (req, res) => {
    const { id } = req.user;
    const { nombre, ciclo_escolar } = req.body;
    const idGrupo = req.params.id;

    try {
        const existGrupo = await pool.query(
            'SELECT * FROM grupos WHERE nombre = $1 AND profesor_id = $2 AND deleted_at IS NULL',
            [nombre, id]
        );

        if (existGrupo.rows.length > 0)
            return res.status(401).json({ message: 'Ya existe un grupo con ese nombre.' });

        await pool.query('UPDATE grupos SET nombre = $1, ciclo_escolar = $2 WHERE id = $3', [
            nombre,
            ciclo_escolar,
            idGrupo,
        ]);

        return res.status(200).json({ message: 'Grupo actualizado exitosamente.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor.', error });
    }
};

// Eliminar grupo - soft delete
export const deleteGrupo = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
        await pool.query('UPDATE grupos SET deleted_at = NOW() WHERE id = $1', [id]);

        return res.status(200).json({ message: 'Grupo eliminado correctamente.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor.', error });
    }
};

// Obtener todos los grupos del profesor
export const getAllGruposByProfesor = async (req, res) => {
    const { id } = req.user;
    try {
        const grupos = await pool.query(
            'SELECT * FROM grupos WHERE profesor_id = $1 AND deleted_at IS NULL',
            [id]
        );

        return res.status(200).json({ grupos: grupos.rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};
