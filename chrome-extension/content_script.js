document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        console.log('Cambio de pestaña o aplicación detectada.');
        enviarAlerta('Cambio de pestaña o aplicación detectado.');
    }
});

document.addEventListener('blur', () => {
    console.log('El usaurio salió de la ventana del examen.');
    enviarAlerta('El usuario salió de la ventana del examen.');
});

document.addEventListener('copy', () => {
    console.log('Intento de copiar contenido detectado.');
    enviarAlerta('Intento de copiar contenido detectado.');
});

document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    console.log('Intento de abrir menú contextual (clic derecho)');
    enviarAlerta('Intento de abrir menu contextual (clic derecho)');
});

function enviarAlerta(detalle) {
    chrome.storage.local.get(['examen'], (result) => {
        if (!result.examen || result.examen.fase !== 'examen') return;
        chrome.runtime.sendMessage({
            action: 'reportar_incidente',
            datos: {
                incidente: {
                    tipo: 'SOSPECHA_TRAMPA',
                    detalle: detalle,
                },
            },
        });
    });
}
