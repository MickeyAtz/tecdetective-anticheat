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

        //Creacion del token de acceso (15 minutos)
        const accessToken = jwt.sign({ email: cuenta.email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15m',
        });

        //Creacion del token de refresh (1 dia)
        const refreshToken = jwt.sign({ email: cuenta.email }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d',
        });

        // Insercion del token a la base de datos (auth_token)
        await pool.query('INSERT INTO auth_tokens(professor_id, refresh_token) VALUES($1, $2)', [
            cuenta.id,
            refreshToken,
        ]);

        // Configuracion de la cookie
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000,
        });

        // Retorno del token
        return res.status(200).json({
            accessToken,
            cuenta: {
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
