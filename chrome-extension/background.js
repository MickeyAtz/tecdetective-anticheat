import { io } from './socket.io.esm.min.js';
import { stateManager, EXAM_STATES } from './StateManager.js';

let socket = null;

chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'iniciar_conexion') {
        conectarServidor(request.datos);
    }

    if (request.action === 'reportar_incidente') {
        manejarIncidente(request.datos);
    }
});

async function manejarIncidente(datosIncidente) {
    const { usuario, examen } = await stateManager.getSession();

    if (!usuario || !examen) {
        console.log('No hay sesion activa en el background.');
        return;
    }

    await asegurarConexion({ usuario, examen });

    if (!socket || !socket.connected) {
        console.log('No hay socket disponible.');
        return;
    }

    socket.emit('notificar_incidente', {
        tipo: datosIncidente.tipo,       
        detalle: datosIncidente.detalle, 
        idParticipante: examen.idParticipante,
        idExamen: examen.idExamen,
        nControl: usuario.nControl
    });

    console.log('Incidente enviado al servidor para el alumno:', usuario.nControl);
}

async function asegurarConexion(datos) {
    if (socket && socket.connected) return;

    await conectarServidor(datos);
    await esperarConexion();
}

function conectarServidor(datos) {
    return new Promise((resolve) => {
        if (socket) socket.disconnect();

        socket = io('http://127.0.0.1:3000', {
            transports: ['websocket'],
        });

        socket.on('connect', () => {
            console.log('Socket conectado');
            socket.emit('unirse_examen', datos);
            resolve();
        });

        socket.on('orden_inicio_examen', async () => {
            await stateManager.updateExamen({
                fase: EXAM_STATES.EXAMEN,
            });

            chrome.runtime.sendMessage({ action: 'cambiar_interfaz_examen' });

            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icon.png',
                title: 'TEC Detective',
                message: 'El examen ha comenzado',
            });
        });
    });
}

function esperarConexion(timeout = 3000) {
    return new Promise((resolve, reject) => {
        const start = Date.now();

        const interval = setInterval(() => {
            if (socket && socket.connected) {
                clearInterval(interval);
                resolve();
            }

            if (Date.now() - start > timeout) {
                clearInterval(interval);
                reject();
            }
        }, 100);
    });
}
