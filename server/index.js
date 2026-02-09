import express from 'express';
import { swaggerDocs, swaggerUi } from './config/swagger.js';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Importacion de rutas del servidor
import authRouter from './routes/auth.routes.js';
import profesorRouter from './routes/profesores.routes.js';
import materiaRouter from './routes/materias.routes.js';
import grupoRouter from './routes/grupos.routes.js';

// Importacion de configuracion
import corsOptions from './config/corsOptions.js';

dotenv.config();

//inicialización de la app y configuración de cors y json
const app = express();

//Midleware
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//Ruta principal provicional
app.get('/', (req, res) => {
    res.send('Servidor corriendo');
});

//Rutas de autenticación
//TODO: Configuración de Rutas y creación de endpoints
app.use('/api/auth', authRouter);
app.use('/api/profesor', profesorRouter);
app.use('/api/materia', materiaRouter);
app.use('/api/grupo', grupoRouter);

const PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});
