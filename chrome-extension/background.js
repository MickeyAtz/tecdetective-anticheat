import { io } from './socket.io.esm.min.js';

let socket = null;
let sesionActual = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'iniciar_conexion') {
        sesionActual = request.datos;
        conectarServidor(request.datos);
    }

    if (request.action === 'reportar_incidente') {
        // Obtenemos los valores del local.storage
        chrome.storage.local.get(['usuario'], (result) => {
            const usuarioSeguro = result.usuario || sesionActual;

            if (socket && socket.connected && usuarioSeguro) {
                console.log(usuarioSeguro);
                socket.emit('notificar_incidente', {
                    ...request.datos,
                    nControl: usuarioSeguro.nControl,
                    claveExamen: usuarioSeguro.claveExamen,
                    idExamen: usuarioSeguro.idExamen,
                });
                console.log('Incidente reportado para: ', usuarioSeguro.nControl);
            }
        });
    }

    console.log('Mensaje recibido en background: ', request.action);
});

function conectarServidor(datos) {
    if (socket) socket.disconnect();

    socket = io('http://127.0.0.1:3000', { transports: ['websocket'] });

    socket.on('connect_error', (error) => {
        console.error('Error critico al conectar Socket.IO: ', error.message);
        console.error('Detalles del error: ', error);
    });

    socket.on('disconnect', (reason) => {
        console.warn('Desconexion del socket: ', reason);
    });

    // Unirse al examen y verificacion de conexion
    socket.on('connect', () => {
        console.log('Socket conectado, uniendose a la sala.');
        socket.emit('unirse_examen', datos);
    });

    socket.on('orden_inicio_examen', (config) => {
        chrome.storage.local.set(
            {
                fase: 'examen',
                horaInicio: new Date().toISOString(),
            },
            () => {
                chrome.runtime.sendMessage({ action: 'cambiar_interfaz_examen' });
            }
        );

        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon.png',
            title: 'TEC Detective',
            message: 'El examen ha comenzado. ¡Buena suerte!',
        });
    });
}
