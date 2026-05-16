import * as XLSX from 'xlsx';

export const exportarExamen = (examen, participantes) => {
    let fechaStr = 'Sin_fecha';

    if (examen.programed_at) {
        const d = new Date(examen.programed_at);
        if (!isNaN(d.getTime())) {
            fechaStr = d.toISOString().split('T')[0];
        }
    }

    const dataRows = participantes.map((p) => ({
        'Matricula/ID': p.nControl || 'N/A',
        'Nombre Completo': p.nombre || 'Desconocido',
        'Total Incidentes': p.incidentes?.length || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataRows);

    worksheet['!cols'] = [
        { wch: 38 }, // ID (UUID largo)
        { wch: 35 }, // Nombre
        { wch: 15 }, // Total
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Resultados');

    // 4. Nombre de archivo limpio
    const nombreLimpio = examen.titulo.replace(/[^a-zA-Z0-9]/g, '_');
    XLSX.writeFile(workbook, `Examen_${nombreLimpio}_${fechaStr}.xlsx`);
};
