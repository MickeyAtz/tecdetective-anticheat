import express from 'express';
import { authLogin } from '../controllers/auth.controller.js';
import { createProfesor } from '../controllers/profesores.controller.js';

const router = express.Router();


router.post('/login', authLogin);

router.post('/profesor', createProfesor);

export default router;
