import express from 'express';

import { verifyToken } from '../middleware/auth.js';

import {
    modifyProfesor,
    deleteProfesor,
    getProfesores,
    changePassword,
} from '../controllers/profesores.controller.js';

const router = express.Router();

router.put('/', verifyToken, modifyProfesor);

router.put('/baja/:id', deleteProfesor);

router.get('/', getProfesores);

router.put('/password/update', verifyToken, changePassword);

export default router;
