import pool from '../db.js';
import bcrypt from 'bcrypt';

export const createMateria = async (req, res) => {
    const { nombre } = req.body;
    const { uid } = req.user;

    console.log(req.user);
    console.log(uid);

    try {
        const materiaExiste = await pool.query(
            'SELECT * FROM materias WHERE nombre = $1 AND profesor_id = $2 AND deleted_at IS NULL',
            [nombre, uid]
        );

        if (materiaExiste.rows.length > 0) {
            return res.status(401).json({ message: 'Ya existe una materia con ese nombre.' });
        }

        await pool.query('INSERT INTO materias(nombre, profesor_id) VALUES($1, $2)', [nombre, uid]);

        return res.status(201).json({ message: 'Materia creada exitosamente.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }
};

export const modifyMateria = async (req, res) => {
    const { nombre, materiaId } = req.body;
    const { uid } = req.user;

    console.log(req.body);

    try {
        const materiaExiste = await pool.query(
            'SELECT * FROM materias WHERE nombre = $1 and profesor_id = $2 AND deleted_at IS NULL',
            [nombre, uid]
        );

        if (materiaExiste.rows.length > 0)
            return res.status(401).json({ message: 'Ya existe una materia con ese nombree.' });

        await pool.query('UPDATE materias SET nombre = $1 WHERE id = $2', [nombre, materiaId]);

        return res.status(200).json({ message: 'Materia actualizada con exito.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const getAllMateriasByProfesor = async (req, res) => {
    const { uid } = req.user;

    try {
        const materias = await pool.query(
            'SELECT * FROM materias WHERE profesor_id = $1 AND deleted_at IS NULL',
            [uid]
        );

        return res.status(200).json({ materias: materias.rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }
};

export const deleteMateria = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('UPDATE materias SET deleted_at = NOW() WHERE id = $1', [id]);

        return res.status(200).json({ message: 'Materia eliminada correctamente.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }
};
