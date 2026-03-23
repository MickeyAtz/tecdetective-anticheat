import { Router } from 'express';

// Importación de rutas individuales
import authRouter from './auth.routes.js';
import profesorRouter from './profesores.routes.js';
import materiaRouter from './materias.routes.js';
import grupoRouter from './grupos.routes.js';
import examenRouter from './examen.routes.js';
import grupoMateriasRouter from './grupo_materias.routes.js';

const router = Router();

// Asignación de cada ruta a su endpoint correspondiente
router.use('/auth', authRouter);
router.use('/profesor', profesorRouter);
router.use('/materia', materiaRouter);
router.use('/grupo', grupoRouter);
router.use('/examen', examenRouter);
router.use('/grupo_materias', grupoMateriasRouter);

export default router;
