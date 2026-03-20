import express from 'express';

import {
    getMateriasAsignadas,
    quitarAsignacionMateria,
    asignarMateria,
    getMateriasDisponibles,
} from '../controllers/grupo_materias.controller.js';

const router = express.Router();

router.get('/disponibles/:idGrupo', getMateriasDisponibles);

router.get('/:idGrupo', getMateriasAsignadas);

router.post('/asignar/:idGrupo/:idMateria', asignarMateria);

router.delete('/:idGrupo/:idMateria', quitarAsignacionMateria);

export default router;
