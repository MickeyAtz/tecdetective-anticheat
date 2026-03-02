document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        enviarAlerta('Cambio de pestaña o aplicación detectado.');
    }
});

document.addEventListener('blur', () => {
    enviarAlerta('El usuario salió de la ventana del examen.');
});

document.addEventListener('copy', () => {
    enviarAlerta('Intento de copiar contenido detectado.');
});

document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    enviarAlerta('Intento de abrir menu contextual (clic derecho)');
});

function enviarAlerta(detalle) {
    chrome.runtime.sendMessage({
        action: 'reportar_incidente',
        datos: {
            tipo: 'SOSPECHA_TRAMPA',
            detalle: detalle,
            timestamp: new Date().toISOString(),
        },
    });
}
