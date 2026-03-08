import React, { useState, useMemo } from 'react';
import Button from '@/components/atoms/Button.jsx';
import Input from '@/components/atoms/Input.jsx';

// Definicion de estilos
const STYLES = {
    wrapper:
        'w-full bg-bg-secondary p-4 rounded-lg border border-border-primary shadow-sm transition-colors duration-300',
    searchContainer: 'mb-4 w-full max-w-md',
    tableContainer: 'overflow-x-auto rounded-t-lg border border-border-primary',
    table: 'w-full text-sm text-left border-collapse',
    thead: 'bg-bg-tertiary text-text-primary border-b border-border-primary',
    headerCell:
        'px-6 py-4 font-bold uppercase tracking-wider cursor-pointer select-none hover:opacity-80 transition-opacity',
    tbody: 'divide-y divide-border-primary bg-bg-secondary',
    row: 'hover:bg-bg-tertiary transition-colors duration-200',
    cell: 'px-6 py-4 whitespace-nowrap text-text-secondary font-medium',
    actionsCell: 'px-6 py-4',
    actionsWrapper: 'flex gap-2 justify-center items-center',
    pagination:
        'flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t border-border-primary',
    pageInfo: 'text-sm text-text-tertiary font-medium',
};

export default function Table({
    columns = [],
    data = [],
    renderCell,
    renderActions,
    rowsPerPage = 6,
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [searchTerm, setSearchTerm] = useState('');

    // Filtrar datos según searchTerm
    const filteredData = useMemo(() => {
        if (!searchTerm) return data;
        return data.filter((row) =>
            Object.values(row).some((value) =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [data, searchTerm]);

    // Ordenar datos según sortConfig
    const sortedData = useMemo(() => {
        if (!sortConfig.key) return filteredData;
        return [...filteredData].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortConfig]);

    // Datos visibles por página
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return sortedData.slice(startIndex, startIndex + rowsPerPage);
    }, [currentPage, sortedData, rowsPerPage]);

    const handleSort = (field) => {
        let direction = 'asc';
        if (sortConfig.key === field && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key: field, direction });
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(sortedData.length / rowsPerPage);

    return (
        <div className={STYLES.wrapper}>
            <div className={STYLES.searchContainer}>
                {/* Buscador */}
                <Input
                    placeholder="Buscar"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />
            </div>

            <div className={STYLES.tableContainer}>
                <table className={STYLES.table}>
                    <thead className={STYLES.thead}>
                        <tr>
                            {columns.map((col) => (
                                <th key={col.field} onClick={() => handleSort(col.field)}>
                                    <div className="flex items-center gap-2">
                                        {col.label}
                                        {sortConfig.key === col.field && (
                                            <span className="text-brand-primary">
                                                {sortConfig.direction === 'asc' ? '▲' : '▼'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                            {renderActions && <th className="px-6 py-4 text-center">Acciones</th>}
                        </tr>
                    </thead>

                    <tbody className={STYLES.body}>
                        {paginatedData.map((row, index) => (
                            <tr key={row.id} className={STYLES.row}>
                                {columns.map((col) => (
                                    <td key={col.field} className={STYLES.cell}>
                                        {renderCell ? renderCell(row, col.field) : row[col.field]}
                                    </td>
                                ))}
                                {renderActions && (
                                    <td className={STYLES.actionsCell}>
                                        <div className={STYLES.actionsWrapper}>
                                            {renderActions(row)}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div className={STYLES.pagination}>
                <div className={STYLES.pageInfo}>
                    Página {currentPage} de {totalPages || 1}
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        size="small"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                        Anterior
                    </Button>
                    <Button
                        variant="secondary"
                        size="small"
                        disabled={currentPage === totalPages || totalPages === 0}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                        Siguiente
                    </Button>
                </div>
            </div>
        </div>
    );
}
