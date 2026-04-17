import pool from '../db.js';

export const socketHandler = (io) => {
    console.log('Socket Handler inicializado y escuchando...');

    io.on('connection', (socket) => {
        console.log('Nueva conexion de socket', socket.id);

        // Union al examen
        socket.on('unirse_examen', (datos) => {
            if (!datos?.examen?.idExamen) return;

            socket.datosConexion = datos;

            socket.join(datos.examen.idExamen);

            console.log(
                `Alumno ${datos.usuario?.nombre_completo || 'Profesor'} en la sala: ${datos.examen.idExamen}`
            );

            if (datos.rol !== 'profesor') {
                socket.to(datos.examen.idExamen).emit('nuevo_participante', datos.usuario);
            }
        });

        // Reconeccion en el profesor side
        socket.on('solicitar_conectados', async (idExamen, callback) => {
            const socketsEnSala = await io.in(idExamen).fetchSockets();
            // Obtenemos los usuarios y los retornamos mediante el callback
            const lista = socketsEnSala
                .filter((s) => s.datosConexion && s.datosConexion.rol !== 'profesor')
                .map((s) => s.datosConexion.usuario);

            callback(lista);
        });

        // Inicializacion del examen
        socket.on('iniciar_examen_profesor', (config) => {
            io.to(config.idExamen).emit('orden_inicio_examen', config);
        });

        // Reportar incidente y guardar en db
        socket.on('notificar_incidente', async (data) => {
            console.log('Solicitud recibida, notificar_incidente: ', data);

            const { idParticipante, tipo, detalle } = data;

            try {
                await pool.query(
                    `
                    INSERT INTO logs_incidentes(participante_id, tipo_evento, descripcion)
                    VALUES($1, $2, $3)
                    `,
                    [idParticipante, tipo, detalle]
                );

                io.to(data.idExamen).emit('alerta_profesor', {
                    ...data,
                    hora: new Date().toLocaleTimeString(),
                });

                console.log('Incidente guardado correctamente.');
            } catch (error) {
                console.error(error);
            }
        });

        socket.on('profesor_cancela_lobby', (data) => {
            console.log('El profesor canceló el lobby del examen: ', data.idExamen);
            io.to(data.idExamen).emit('lobby_cancelado_por_profesor');
        });

        socket.on('profesor_finaliza_examen', (data) => {
            console.log('El profesor finalizó el examen: ', data.idExamen);
            io.to(data.idExamen).emit('orden_fin_examen');
        });

        socket.on('disconnect', () => {
            if (!socket.datosConexion) return;

            const { examen, usuario, rol } = socket.datosConexion;

            if (rol === 'profesor') return;

            console.log(`Alumno desconectado: ${usuario?.nombre}`);

            socket.to(examen.idExamen).emit('participante_desconectado', {
                nControl: usuario.nControl,
            });
        });
    });
};
