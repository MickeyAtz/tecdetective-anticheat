import pool from '../db.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;

    try {
        const result = await pool.query('SELECT * FROM auth_tokens WHERE refresh_token = $1', [
            refreshToken,
        ]);

        if (result.rows.length == 0) return res.status(403);

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.status(403);

            const accessToken = jwt.sign(
                { email: decoded.email },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );

            res.json({ accessToken });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

export default handleRefreshToken;
