import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
    validarExamen,
    createExamen,
    obtenerExamenes,
    obtenerExamenPorId,
    cambiarEstadoExamen,
    eliminarExamen,
    actualizarExamen,
    getHistorialExamen,
} from '../controllers/examen.controller.js';

const router = express.Router();

router.post('/validar', validarExamen);

router.post('/', verifyToken, createExamen);

router.get('/', verifyToken, obtenerExamenes);

router.get('/:id', verifyToken, obtenerExamenPorId);

router.put('/:id', verifyToken, actualizarExamen);

router.put('/:id/estado', verifyToken, cambiarEstadoExamen);

router.delete('/:id', verifyToken, eliminarExamen);

router.get('/resultados/:id', verifyToken, getHistorialExamen);

export default router;
