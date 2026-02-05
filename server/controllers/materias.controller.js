import pool from '../db.js';
import bcrypt from 'bcrypt';

export const createMateria = async (req, res) => {
    const { nombre } = req.body;

    try {
        const materiaExiste = await pool.query(
            'SELECT * FROM materias WHERE nombre = $1 AND profesor_id = $2',
            [nombre, id]
        );

        if (materiaExiste.rows.length > 0) {
            return res.status(401).json({ message: 'Ya existe una materia con ese nombre.' });
        }

        return res.status(201).json({ message: 'Materia creada exitosamente.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }
};


