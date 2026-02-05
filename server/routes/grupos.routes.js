import express from 'express';
import { verifyToken } from '../middleware/auth.js';

import {
    createGrupo,
    modifyGrupo,
    deleteGrupo,
    getAllGruposByProfesor,
} from '../controllers/grupos.controller.js';

const router = express.Router();

router.use(verifyToken);

/**
 * @openapi
 * /api/v1/grupo/:
 *   post:
 *     summary: Crear grupo
 *     tags: [CRUD - Grupos]
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
 *               - ciclo_escolar
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "8vo Sistemas"
 *               ciclo_escolar:
 *                 type: string
 *                 example: "2026A"
 *     responses:
 *       201:
 *         description: Grupo creado correctamente
 *       400:
 *         description: Ya existe un grupo con ese nombre
 *       500:
 *         description: Error en el servidor
 */
router.post('/', createGrupo);

/**
 * @openapi
 * /api/v1/grupo/{id}:
 *   put:
 *     summary: Edición de grupos
 *     description: Edición de un grupo
 *     tags: [CRUD - Grupos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del grupo a modificar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - ciclo_escolar
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "8vo Sistemas"
 *               ciclo_escolar:
 *                 type: string
 *                 example: "2026B"
 *     responses:
 *       200:
 *         description: Grupo actualizado correctamente.
 *       400:
 *         description: Ya existe un grupo con ese nombre.
 *       401:
 *         description: Token no proporcionado o inválido.
 *       500:
 *         description: Error en el servidor
 */
router.put('/:id', modifyGrupo);

/**
 * @openapi
 * /api/v1/grupo/baja/{id}:
 *   put:
 *     summary: Eliminación de un grupo
 *     description: Eliminación lógica de un grupo mediante id
 *     tags: [CRUD - Grupos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del grupo a eliminar (eliminación lógica)
 *     responses:
 *       200:
 *         description: Grupo eliminado correctamente.
 *       401:
 *         description: Token no proporcionado o inválido.
 *       500:
 *         description: Error en el servidor
 */
router.put('/baja/:id', deleteGrupo);

/**
 * @openapi
 * /api/v1/grupo/:
 *   get:
 *     summary: Obtener todos los grupos
 *     description: Obtener todos los grupos del profesor que lo solicitó
 *     tags: [CRUD - Grupos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de grupos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                 id:
 *                   type: string
 *                 nombre:
 *                   type: string
 *                 profesor_id:
 *                   type: string
 *                 ciclo_escolar:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 deleted_at:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: Error en el servidor
 */
router.get('/', getAllGruposByProfesor);

export default router;
