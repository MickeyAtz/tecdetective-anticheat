import express from 'express';

import { verifyToken } from '../middleware/auth.js';

import {
    createMateria,
    getAllMateriasByProfesor,
    modifyMateria,
    deleteMateria,
} from '../controllers/materias.controller.js';

const router = express.Router();

router.use(verifyToken);

/**
 * @openapi
 * /api/v1/materia/:
 *   post:
 *     summary: Creacion de materia
 *     tags: [CRUD - Materias]
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
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Programación Lógica y Funcional"
 *     responses:
 *       201:
 *         description: Materia creada correctamente
 *       400:
 *         description: Materia ya registrada
 *       500:
 *         description: Fallo en el servidor
 */
router.post('/', createMateria);

/**
 * @openapi
 * /api/v1/materia/{id}:
 *   put:
 *     summary: Edicion de materia
 *     tags: [CRUD - Materias]
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
 *               - materiaId
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Taller de Investigación II"
 *               materiaId:
 *                 type: int
 *                 example: 2
 *     responses:
 *       200:
 *         description: Materia actualizada correctamente.
 *       400:
 *         description: Materia ya registrada.
 *       401:
 *         description: Token no proporcionado o inválido.
 *       500:
 *         description: Fallo en el servidor.
 */
router.put('/:id', modifyMateria);

/**
 * @openapi
 * /api/v1/materia/:
 *   get:
 *     summary: Obtener lista de materias por profesor
 *     tags: [CRUD - Materias]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de materias obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: int
 *                   nombre:
 *                     type: string
 *                   profesor_id:
 *                     type: string
 *                   creado_at:
 *                     type: string
 *                     format: date-time
 *                   deleted_at:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Error en el servidor
 */
router.get('/', getAllMateriasByProfesor);

/**
 * @openapi
 * /api/v1/materia/baja/{id}:
 *   put:
 *     summary: Eliminar materia
 *     description: Eliminacion logica de materia
 *     tags: [CRUD - Materias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: int
 *         descripcion: ID de la materia a eliminar
 *     responses:
 *       200:
 *         description: Materia dada de baja correctamente.
 *       401:
 *         description: Token no proporcionado.
 *       500:
 *         description: Fallo en el servidor
 */
router.put('/baja/:id', deleteMateria);
export default router;
