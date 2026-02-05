import express from 'express';
import { swaggerDocs, swaggerUi } from './config/swagger.js';
import cors from 'cors';
import dotenv from 'dotenv';

// Importacion de rutas del servidor
import authRouter from './routes/auth.routes.js';
import profesorRouter from './routes/profesores.routes.js';
import materiaRouter from './routes/materias.routes.js';
dotenv.config();

//inicialización de la app y configuración de cors y json
const app = express();

//Midleware
app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//Ruta principal provicional
app.get('/', (req, res) => {
    res.send('Servidor corriendo');
});

//Rutas de autenticación
//TODO: Configuración de Rutas y creación de endpoints
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/profesor', profesorRouter);
app.use('/api/v1/materia', materiaRouter);

const PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en: https://localhost:${PORT}`);
});
