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

router.post('/', createMateria);

router.put('/:id', modifyMateria);

router.get('/', getAllMateriasByProfesor);


router.put('/baja/:id', deleteMateria);

export default router;
