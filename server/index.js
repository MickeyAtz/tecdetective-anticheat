import express from 'express';
import { swaggerDocs, swaggerUi } from './config/swagger.js';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';

// Importacion de configuracion
import corsOptions from './config/corsOptions.js';
import { socketHandler } from './socket/socketHandler.js';

// Enrutador central
import apiRouter from './routes/index.routes.js';

dotenv.config();

//inicialización de la app y configuración de cors y json
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: corsOptions,
});

app.set('socketio', io);

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
app.use('/api', apiRouter);

socketHandler(io);

const PORT = process.env.BACKEND_PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Servidor hibrido (REST + Sockets) corriendo en http://localhost:${PORT}`);
});
