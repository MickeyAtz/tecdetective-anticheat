import express from 'express';
import { authLogin, handleLogout } from '../controllers/auth.controller.js';
import handleRefreshToken from '../controllers/refreshToken.controller.js';

const router = express.Router();

/**
 * @openapi
 * /api/v1/auth/login-profesor:
 *  post:
 *    summary: Iniciar sesión del profesor
 *    tags: [Autenticación]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                example: "zeravla.miguel@gmail.com"
 *              password:
 *                type: string
 *                example: "mky123"
 *    responses:
 *      200:
 *        description: Login exitoso
 *      401:
 *        description: Credenciales incorrectas
 */

router.post('/login', authLogin);

router.get('/refresh', handleRefreshToken);
router.get('/logout', handleLogout);

export default router;
