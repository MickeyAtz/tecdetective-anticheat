import pool from '../db.js';

export const socketHandler = (io) => {
    console.log('Socket Handler iinicializado y escuchando...');

    io.on('connection', (socket) => {
        console.log('Nueva conexion de socket', socket.id);

        // Union al examen
        socket.on('unirse_examen', (datos) => {
            if (!datos || !datos.claveExamen) return;

            socket.datosUsuario = datos;
            socket.join(datos.idExamen);

            console.log(`Alumno ${datos.nombre} en la sala: ${datos.claveExamen}`);

            if (datos.rol !== 'profesor') {
                socket.to(datos.claveExamen).emit('nuevo_participante', datos);
            }
        });

        // Reconeccion en el profesor side
        socket.on('solicitar_conectados', async (idExamen, callback) => {
            const socketsEnSala = await io.in(idExamen).fetchSockets();
            const lista = socketsEnSala
                .filter((s) => s.datosUsuario && s.datosUsuario.rol !== 'profesor')
                .map((s) => s.datosUsuario);

            console.log('Lista solicitada: ', lista);

            callback(lista);
        });

        // Inicializacion del examen
        socket.on('iniciar_examen_profesor', (config) => {
            // Mensaje para extension web
            io.to(config.idExamen).emit('orden_inicio_examen', config);
            console.log('El profesor inicio el examen: ', config.idExamen);
        });

        // Reportar incidente y guardar en db
        socket.on('notificar_incidente', async (data) => {
            const { nControl, tipo, detalle, claveExamen, nombre } = data;
            try {
                await pool.query(
                    `
                        INSERT INTO logs_incidentes(participante_id, tipo_evento, descripcion) 
                        VALUES(
                            (SELECT id FROM pariticpantes WHERE ), 
                            )
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
