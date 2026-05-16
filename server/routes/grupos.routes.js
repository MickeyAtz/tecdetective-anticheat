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

router.post('/', createGrupo);

router.put('/:id', modifyGrupo);

router.put('/baja/:id', deleteGrupo);

router.get('/', getAllGruposByProfesor);

export default router;
