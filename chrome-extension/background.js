import { io } from './socket.io.esm.min.js';

let socket = null;
let sesionActual = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'iniciar_conexion') {
        sesionActual = request.datos;
        conectarServidor(request.datos);
    }

    if (request.action === 'reportar_incidente') {
        if (socket && socket.connected) {
            socket.emit('notficar_incidente', {
                ...request.datos,
                nControl: datosAlumno.nControl,
                claveExamen: datosAlumno.claveExamen,
            });
            console.log('Incidente reportado para: ', sesionActual.nControl);
        }
    }
});

function conectarServidor(datos) {
    if (socket) socket.disconnect();

    socket = io('http://localhost:3000');

    socket.emit('unirse_examen', datos);

    socket.on('orden_inicio_examen', (config) => {
        chrome.storage.local.set(
            {
                fase: 'examen',
                horaInicioReal: new Date().toISOString(),
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
