export const navBarItems = [
    { id: 1, label: 'Dashboard', path: '/' },
    { id: 2, label: 'Examenes', path: '/examenes' },
    {
        id: 3,
        label: 'Gestión',
        isDropdown: true,
        subItems: [
            { label: 'Materias', path: '/gestion/materias' },
            { label: 'Grupos', path: '/gestion/grupos' },
        ],
    },
    { id: 4, label: 'Pruebas', path: '/pruebas' },
];
