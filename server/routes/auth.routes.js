import express from 'express';
import { authLogin } from '../controllers/auth.controller.js';
import { createProfesor } from '../controllers/profesores.controller.js';

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


/**
 * @openapi
 * /api/auth/profesor/:
 *   post:
 *     summary: Crear profesor (dar de alta en db)
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - password
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Miguel Angel Alvarez Tabarez"
 *               email:
 *                 type: string
 *                 example: "correo@dominio.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Profesor creado exitosamente
 *       400:
 *         description: El correo ya esta registrado
 *       500:
 *         description: Fallo en el servidor
 */
router.post('/profesor', createProfesor);

export default router;
