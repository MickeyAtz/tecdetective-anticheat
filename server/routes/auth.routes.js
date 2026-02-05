import express from 'express';
import { authLogin } from '../controllers/auth.controller.js';

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

router.post('/login-profesor', authLogin);

export default router;
