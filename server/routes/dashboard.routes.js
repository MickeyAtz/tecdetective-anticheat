import express from 'express';
import { verifyToken } from '../middleware/auth.js';

import { getDashboardData } from '../controllers/dashboard.controller.js';

const router = express.Router();

router.use(verifyToken);

router.get('/summary', getDashboardData);

export default router;
