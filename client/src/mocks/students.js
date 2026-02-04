export const STUDENTS_MOCK = [
    {
        id: 'st-001',
        nombre: 'Miguel Ángel Álvarez',
        status: 'success',
        incidents: [], 
    },
    {
        id: 'st-002',
        nombre: 'Alondra García',
        status: 'warning',
        incidents: [
            {
                id: 'inc-1',
                nombre: 'Cambio de pestaña',
                descripcion:
                    'Se detectó salida del navegador por más de 5 segundos.',
                fechaYHora: '10:15 AM',
            },
        ],
    },
    {
        id: 'st-003',
        nombre: 'Carlos Tabarez',
        status: 'danger',
        incidents: [
            {
                id: 'inc-2',
                nombre: 'Objeto no permitido',
                descripcion: 'Detección de dispositivo móvil en cámara.',
                fechaYHora: '10:42 AM',
            },
            {
                id: 'inc-3',
                nombre: 'Múltiples rostros',
                descripcion: 'Se detectó una segunda persona en el encuadre.',
                fechaYHora: '10:45 AM',
            },
        ],
    },
    {
        id: 'st-004',
        nombre: 'Betín Álvarez',
        status: 'success',
        incidents: [],
    },
];
