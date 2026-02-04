import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

import pool from '../db.js';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const authLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(400)
            .json({ message: 'Email y contraseña requeridos.' });
    }

    try {
        const { rows } = await pool.query(
            'SELECT * FROM profesores WHERE LOWER(email) = LOWER($1)',
            [email]
        );

        if (rows.length === 0)
            return res
                .status(401)
                .json({ message: 'Credenciales incorrectas.' });

        const cuenta = rows[0];
        const validPassword = await bcrypt.compare(
            password,
            cuenta.password_hash
        );

        if (!validPassword) {
            return res
                .status(401)
                .json({ message: 'Credenciales incorrectas.' });
        }

        const payload = {
            uid: cuenta.id,
            nombre: cuenta.nombre,
        };

        const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: '1d',
        });

        return res.status(200).json({
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor.' });
    }
};
