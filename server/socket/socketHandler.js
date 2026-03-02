import pool from '../db.js';

export const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log('Nueva conexion de socket', socket.id);

        // Union al examen
        socket.on('unirse_examen', (datos) => {
            if (!datos || !datos.claveExamen) return;
            socket.join(datos.claveExamen);
            console.log(`Alumno ${datos.nombre} en la sala: ${datos.claveExamen}`);
        });

        // Reportar incidente y guardar en db
        socket.on('notificar_incidente', async (data) => {
            const { nControl, tipo, detalle, claveExamen, nombre } = data;
            try {
                await pool.query(
                    `
                        INSERT INTO incidentes (numero_control, tipo, detalle, clave_examen, fecha)
                        VALUES($1, $2, $3, $4, NOW())
                    `,
                    [nControl, tipo, detalle, claveExamen]
                );

                io.to(claveExamen).emit('alerta_profesor', {
                    nControl,
                    nombre,
                    tipo,
                    detalle,
                    hora: new Date().toLocaleTimeString(),
                });
            } catch (error) {
                console.error(error);
            }
        });

        socket.on('disconnect', () => {
            console.log('Cliente socket desconectado');
        });
    });
};
