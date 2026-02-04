import pool from '../db.js';
import bcrypt from 'bcrypt';

// Operaciones CRUD
// Crear profesor
export const createProfesor = async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
        const userExist = await pool.query('SELECT * FROM profesores WHERE email = $1', [email]);

        if (userExist.rows.length > 0) {
            return res.status(400).json({ message: 'El correo ya está registrado.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const nuevo = await pool.query(
            'INSERT INTO profesores(nombre, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
            [nombre, email, hashedPassword]
        );

        const user = nuevo[0];

        return res.status(200).json({ message: 'Profesor creado exitosamente.', user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }
};

// Editar profesor
export const editProfesor = async (req, res) => {
    const { id } = req.params;
    const { nombre, email } = req.body;

    try {
        const checkEmail = await pool.query(
            'SELECT * FROM profesores WHERE email = $1 AND id != $2',
            [email, id]
        );

        if (checkEmail.rows.length > 0) {
            return res.status(400).json({ message: 'El email ya está en uso por otra cuenta.' });
        }

        await pool.query('UPDATE profesores SET nombre = $2, email = $3 WHERE id = $1', [
            id,
            nombre,
            email,
        ]);

        return res.status(200).json({ message: 'Profesor actualizado correctamente.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }
};

// Eliminar profesor (soft delete)
export const deleteProfesor = async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('UPDATE profesores SET deleted_at = NOW() WHERE id = $1', [id]);

        return res.status(200).json({ message: 'Profesor eliminado correctamente.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }
};

// Obtener todos los profesores
export const getProfesores = async (req, res) => {
    try {
        const profesores = await pool.query('SELECT * FROM profesores WHERE deleted_at IS NULL');

        return res.status(200).json({
            profesores: profesores.rows,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }
};
