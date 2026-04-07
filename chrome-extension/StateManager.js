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
    async setSession(usuarioData = null, examenData = null) {
        return new Promise((resolve) => {
            const data = {
                examen: examenData,
                usuario: usuarioData,
            };

            if (examenData && examenData.fase === EXAM_STATES.EXAMEN) {
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
                return resolve({
                    examen: { fase: EXAM_STATES.REGISTRO },
                    usuario: null,
                    horaInicio: null,
                });
            }

            chrome.storage.local.get(['examen', 'usuario', 'horaInicio'], (result) => {
                if (chrome.runtime.lastError) {
                    console.error('Error en el Storage: ', chrome.runtime.lastError);
                    return resolve({ examen: { fase: EXAM_STATES.REGISTRO }, usuario: null });
                }

                resolve({
                    examen: result.examen || { fase: EXAM_STATES.REGISTRO },
                    usuario: result.usuario || null,
                    horaInicio: result.horaInicio || null,
                });
            });
        });
    }

    // BORRRAR SESIÓN DEL EXAMEN
    async clearSession() {
        return new Promise((resolve) => {
            chrome.storage.local.remove(['examen', 'horaInicio'], () => {
                resolve();
            });
        });
    }

    // BORRAR TODOS LOS DATOS DEL USUARIO Y EXAMEN
    async logout() {
        return new Promise((resolve) => {
            chrome.storage.local.clear(() => {
                resolve();
            });
        });
    }

    // ACTUALIZACION DEL EXAMEN
    async updateExamen(nuevosDatos) {
        const { examen } = await this.getSession();

        const examenActualizado = {
            ...(examen || {}),
            ...nuevosDatos,
        };

        const data = {
            examen: examenActualizado,
        };

        if (nuevosDatos.fase === EXAM_STATES.EXAMEN) {
            data.horaInicio = new Date().toISOString();
        }

        return chrome.storage.local.set(data);
    }
}

export const stateManager = new StateManager();
