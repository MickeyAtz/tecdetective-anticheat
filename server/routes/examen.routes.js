import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { validarExamen, createExamen, obtenerExamenes } from '../controllers/examen.controller.js';

const router = express.Router();

//TODO: Resto de endpoints del examen
router.post('/validar', validarExamen);

router.post('/', verifyToken, createExamen);

router.get('/', verifyToken, obtenerExamenes);

export default router;
