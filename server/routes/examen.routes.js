import express from 'express';
import { validarExamen } from '../controllers/examen.controller.js';

const router = express.Router();

//TODO: Resto de endpoints del examen
router.post('/validar', validarExamen);

export default router;
