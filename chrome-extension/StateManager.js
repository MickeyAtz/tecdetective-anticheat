// GESTIÓN DE ESTADOS
export const EXAM_STATES = {
    REGISTRO: 'registro', // FASE DE REGISTRO
    ESPERA: 'espera', // FASE DE ESPERA
    EXAMEN: 'examen', // FASE DE EXAMEN
    TERMINADO: 'terminado', // FASE DE EXAMEN TERMINADO
};

class StateManager {
    // CREAR SESION
    // guarda el estado actual y datos del usuario
    async setSession(fase, usuarioData = null) {
        return new Promise((resolve) => {
            const data = {
                fase: fase,
                usuario: usuarioData,
            };

            if (fase === EXAM_STATES.EXAMEN) {
                data.horaInicio = new Date().toISOString();
            }

            chrome.storage.local.set(data, () => {
                resolve();
            });
        });
    }

    // OBTENER SESION GUARDADA
    // Recupera toda la información guardada
    async getSession() {
        return new Promise((resolve) => {
            if (typeof chrome === 'undefined' || !chrome.storage) {
                console.warn('Entorno no compatible con Chrome Storage.');
                return resolve({ fase: 'registro', usuario: null });
            }

            chrome.storage.local.get(['fase', 'usuario', 'horaInicio'], (result) => {
                if (chrome.runtime.lastError) {
                    console.error('Error en el Storage: ', chrome.runtime.lastError);
                    return resolve({ false: 'registro', usuario: null });
                }

                resolve({
                    fase: result.fase || EXAM_STATES.REGISTRO,
                    usuario: result.usuario || null,
                    horaInicio: result.horaInicio || null,
                });
            });
        });
    }

    // BORRRAR SESIÓN
    // Limpia la sesión actual del usuario
    async clearSession() {
        return new Promise((resolve) => {
            chrome.storage.local.clear(() => {
                resolve();
            });
        });
    }

    async updateFase(nuevaFase) {
        return chrome.storage.local.set({ fase: nuevaFase });
    }
}

export const stateManager = new StateManager();
