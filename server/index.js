import express from "express";
import cors from "cors";

import dotenv from "dotenv";

dotenv.config();

//inicialización de la app y configuración de cors y json
const app = express();

//Midleware
app.use(cors());
app.use(express.json());

//Ruta principal provicional 
app.get("/", (req, res) => {
  res.send("Servidor corriendo");
});

//Rutas de autenticación 
//TODO: Configuración de Rutas y creación de endpoints


const PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en: https://localhost:${PORT}`);
});
