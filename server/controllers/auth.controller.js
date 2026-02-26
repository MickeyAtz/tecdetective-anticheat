import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

import pool from '../db.js';

dotenv.config();

export const authLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña requeridos.' });
    }

    try {
        // Verificacion del correo
        const { rows } = await pool.query(
            'SELECT * FROM profesores WHERE LOWER(email) = LOWER($1) AND deleted_at IS NULL',
            [email]
        );

        if (rows.length === 0)
            return res.status(401).json({ message: 'Credenciales incorrectas.' });

        const cuenta = rows[0];
        const validPassword = await bcrypt.compare(password, cuenta.password_hash);

        if (!validPassword) {
            return res.status(401).json({ message: 'Credenciales incorrectas.' });
        }

        //Creacion del token (1d)
        const token = jwt.sign(
            { email: cuenta.email, user: cuenta.user },
            process.env.JWT_TOKEN_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN,
            }
        );

        // Retorno del token
        return res.status(200).json({
            token,
            user: {
                id: cuenta.id,
                nombre: cuenta.nombre,
                email: cuenta.email,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor.' });
    }
};

export const handleLogout = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(204);

    const refreshToken = cookies.jwt;

    try {
        await pool.query('DELETE FROM auth_tokens WHERE refresh_token = $1', [refreshToken]);

        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

        return res.status(204);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};
