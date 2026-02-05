import express from 'express';

import { verifyToken } from '../middleware/auth.js';

import {
    createProfesor,
    modifyProfesor,
    deleteProfesor,
    getProfesores,
} from '../controllers/profesores.controller.js';

const router = express.Router();

router.use(verifyToken);

/**
 * @openapi
 * /api/v1/profesor/:
 *   post:
 *     summary: Crear profesor (dar de alta en db)
 *     tags: [CRUD - Profesores]
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
router.post('/', createProfesor);

/**
 * @openapi
 * /api/v1/profesor/{id}:
 *   put:
 *     summary: Editar un profesor
 *     tags: [CRUD - Profesores]
 *     security:
 *        - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del profesor a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Miguel Angel Alvarez Tabarez"
 *               email:
 *                 type: string
 *                 example: "correo@dominio.com"
 *     responses:
 *       200:
 *         description: Profesor actualizado correctamente
 *       400:
 *         description: El email ya está en uso por otra cuenta
 *       500:
 *         description: Fallo en el servidor
 */
router.put('/:id', modifyProfesor);

/**
 * @openapi
 * /api/v1/profesor/baja/{id}:
 *  put:
 *    summary: Baja de profesor (Soft Delete)
 *    description: Realiza un borrado lógico marcando la columna deleted at sin eliminar la evidencia.
 *    tags: [CRUD - Profesores]
 *    security:
 *       - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID del profesor a dar de baja
 *    responses:
 *      200:
 *        description: Profesor dado de baja correctamente
 *      500:
 *        description: Fallo en el servidor
 */
router.put('/baja/:id', deleteProfesor);

/**
 * @openapi
 * /api/v1/profesor/:
 *  get:
 *    summary: Obtener todos los profesores
 *    description: Obtener todos los profesores de la base de datos
 *    tags: [CRUD - Profesores]
 *    security:
 *       - bearerAuth: []
 *    responses:
 *      200:
 *        description: Lista de profesores obtenida correctamente
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                  nombre:
 *                    type: string
 *                  email:
 *                    type: string
 *                  password_hash:
 *                    type: string
 *                  created_at:
 *                    type: string
 *                    format: date-time
 *                  deleted_at:
 *                    type: string
 *                    format: date-time
 *      500:
 *        description: Error en el servidor
 */
router.get('/', getProfesores);

export default router;
