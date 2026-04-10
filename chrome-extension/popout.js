import { stateManager, EXAM_STATES } from './StateManager.js';

document.addEventListener('DOMContentLoaded', async () => {
    const { examen, usuario } = await stateManager.getSession();
    const fase = examen?.fase || EXAM_STATES.REGISTRO;

    // Referencias a contenedores principales
    const formSection = document.getElementById('form-section');
    const statusSection = document.getElementById('status-section');
    const container = document.getElementById('status-card');

    const nControlGroup = document.getElementById('nControl-group');
    const nombreGroup = document.getElementById('nombre-group');
    const formTitle = document.getElementById('form-title');

    const userInfo = document.getElementById('user-info');
    const userNombre = document.getElementById('user-nombre');
    const userControl = document.getElementById('user-control');
    const btnLogout = document.getElementById('btn-logout');

    if (usuario) {
        nControlGroup.style.display = 'none';
        nombreGroup.style.display = 'none';

        userInfo.style.display = 'block';
        userNombre.innerText = usuario.nombre;
        userControl.innerText = usuario.nControl;

        formTitle.innerText = 'Ingresa la clave del examen.';
        document.getElementById('nControl').value = usuario.nControl;
        document.getElementById('nombre').value = usuario.nombre;
    }

    btnLogout.addEventListener('click', async () => {
        await stateManager.logout();

        const { examen, usuario } = await stateManager.getSession();
        const fase = examen?.fase || EXAM_STATES.REGISTRO;

        renderizarInterfaz(fase, usuario, examen, container);

        formSection.style.display = 'block';
        statusSection.style.display = 'none';

        document.getElementById('nControl').value = '';
        document.getElementById('nombre').value = '';
        document.getElementById('claveExamen').value = '';
    });

    if (fase !== EXAM_STATES.REGISTRO) {
        formSection.style.display = 'none';
        statusSection.style.display = 'block';
        renderizarInterfaz(fase, usuario, examen, container);
    }

    const registroForm = document.getElementById('registroForm');
    registroForm.addEventListener('click', async (e) => {
        e.preventDefault();
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
        // Revision de respuesta y logica para comenzar.
        if (response.status === 200) {
            // Impresion de mensaje de reconexion
            if (!result.ok) {
                alert(result.message);
            }

            const usuarioData = {
                nControl: data.nControl,
                nombre: data.nombre,
            };

            const examenData = {
                claveExamen: data.claveExamen,
                idExamen: result.idExamen,
                idParticipante: result.idParticipante,
                rol: 'estudiante',
                fase: EXAM_STATES.ESPERA,
            };

            // Cambio de estado de la sesion (Nuevo ingreso)
            await stateManager.setSession(usuarioData, examenData);

            // Comunicacion con bakground.js
            chrome.runtime.sendMessage({
                action: 'iniciar_conexion',
                datos: {
                    usuario: usuarioData,
                    examen: examenData,
                    rol: 'estudiante',
                },
            });

            // Ocultar formulario y mostrar tarjeta
            formSection.style.display = 'none';
            statusSection.style.display = 'block';
            renderizarInterfaz(EXAM_STATES.ESPERA, usuarioData, examenData, container);
        } else {
            alert('ERROR' + result.message);
        }
    });

    // Recibir evento para cambiar la interfaz
    chrome.runtime.onMessage.addListener(async (request) => {
        if (request.action === 'cambiar_interfaz_examen') {
            const { examen, usuario } = await stateManager.getSession();
            const fase = examen?.fase || EXAM_STATES.REGISTRO;

            renderizarInterfaz(fase, usuario, examen, container);
        }
    });
});

function renderizarInterfaz(fase, usuario, examen, container) {
    if (!container) return;
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
            <h3>${examen.claveExamen}</h3>
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
        iniciarCronometro(examen.horaInicio, ejecucionClock);
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

            // Regresamos al formulario
            document.getElementById('status-section').style.display = 'none';
            document.getElementById('form-section').style.display = 'block';

            // Limpieza de inputs
            document.getElementById('nControl').value = '';
            document.getElementById('nombre').value = '';
            document.getElementById('claveExamen').value = '';
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
