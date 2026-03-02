import { stateManager, EXAM_STATES } from './StateManager.js';

document.addEventListener('DOMContentLoaded', async () => {
    const { fase, usuario, horaInicio } = await stateManager.getSession();

    // Referencias a contenedores principales
    const formSection = document.getElementById('form-section');
    const statusSection = document.getElementById('status-section');
    const container = document.getElementById('status-card');

    if (fase !== EXAM_STATES.REGISTRO) {
        formSection.style.display = 'none';
        statusSection.style.display = 'block';
        renderizarInterfaz(fase, usuario, horaInicio, container);
    }

    const registroForm = document.getElementById('registroForm');
    registroForm.addEventListener('click', async () => {
        //Creacion de la data para solicitud a la DB
        const data = {
            nControl: document.getElementById('nControl').value,
            nombre: document.getElementById('nombre').value,
            claveExamen: document.getElementById('claveExamen').value,
        };
        //SOLICITUD A LA DB (VERIFICACION DE EXAMEN)
        const response = await fetch('http://localhost:3000/api/examen/validar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        // Si el resultado esta bien, inicializamos el socket y cambiamos la sesion a modo espera.

        if (result.ok) {
            // Cambio de estado en la sesion
            await stateManager.setSession(EXAM_STATES.ESPERA, data);
            // Mandamos mensaje a background.js y recargamos la pagina
            chrome.runtime.sendMessage({ action: 'iniciar_conexion', datos: data });
            location.reload();
        } else {
            alert('ERROR: ' + result.message);
        }
    });

    // Recibir evento para cambiar la interfaz
    chrome.runtime.onMessage.addListener((request) => {
        if (request.action === 'cambiar_interfaz_examen') {
            location.reload();
        }
    });
});

function renderizarInterfaz(fase, usuario, horaInicio, container) {
    if(!container) return;
    // Limpieza de estados/clases del container
    container.className = 'status-card';

    // ESTADO EN ESPEARA (CARGA DE HTML Y CSS PARA DICHO ESTADO)
    if (fase === EXAM_STATES.ESPERA) {
        container.classList.add('card-status-espera');
        container.innerHTML = `
            <div class = "status-header">
                <span class = "connection-dot online"></span>
                <span class = "status-text">EN ESPERA</span>
                <span>Por favor no cierres el navegador...</span>
            </div>    
            <h3>${usuario.claveExamen}</h3>
            <p>Alumno: ${usuario.nombre}</p>
            <p class="hint">El examen comenzará pronto...</p>
        `;
    }
    // ESTADO EXAMEN
    else if (fase === EXAM_STATES.EXAMEN) {
        container.classList.add('card-status-examen');
        container.innerHTML = `
            <div class="status-header">
                <span></span>
                <span></span>
            </div>
            <div class = "timer-grid">
                <div class = "timer-box">
                    <small>Transcurrido: </small>
                    <div id = "ejecucion-clock">00:00:00</div>
                </div>
                <div class="timer-box">
                    <small>Cierre: </small>
                    <div id="hora-fin">--:--</div>
                </div>
            </div>
            <p class ="student-footer">${usuario.nControl} - ${usuario.nombre}</p>
        `;
        const ejecucionClock = document.getElementById('ejecucion-clock');
        iniciarCronometro(horaInicio, ejecucionClock);
    }
    // ESTADO TERMINADO
    else if (fase === EXAM_STATES.TERMINADO) {
        container.classList.add('card-status-terminado');
        container.innerHTML = `
            <h2>Examen Finalizado</h2>
            <p>Tu participacion ha sido registrada correctamente.</p>
            <button id="btn-logout" class="btn-round-danger">Cerrar Sesión</button>
        `;
        document.getElementById('btn-logout').onclick = () => {
            stateManager.clearSession();
            location.reload();
        };
    }
}

const iniciarCronometro = (horaInicioServidor, cronometroDisplay) => {
    let startTime = new Date(horaInicioServidor);

    setInterval(() => {
        const now = new Date();
        const diff = now - startTime;

        const horas = Math.floor(diff / (1000 * 60 * 60));
        const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diff % (1000 * 60)) / 1000);

        cronometroDisplay.innerText = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
    }, 1000);
};
