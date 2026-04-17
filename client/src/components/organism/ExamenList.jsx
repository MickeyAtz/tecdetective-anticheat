import React, { useEffect, useState } from 'react';
import ExamenCard from '@/components/molecules/ExamenCard.jsx';

import Button from '@/components/atoms/Button.jsx';

const ExamenList = ({
    examenes,
    onEdit,
    onDelete,
    onStatusChange,
    onStartExamen,
    onViewMonitor,
    onViewResults,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    useEffect(() => {
        setCurrentPage(1);
    }, [examenes]);

    const totalPages = Math.ceil(examenes.length / itemsPerPage);
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentItems = examenes.slice(firstIndex, lastIndex);

    const goToNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const goToPrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    return (
        <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentItems.map((examen) => (
                    <ExamenCard
                        key={examen.id}
                        examen={examen}
                        onEdit={() => onEdit(examen)}
                        onDelete={() => onDelete(examen.id)}
                        onStatusChange={onStatusChange}
                        onStartExamen={() => onStartExamen(examen.id)}
                        onViewMonitor={() => onViewMonitor(examen.id)}
                        onViewResults={() => onViewResults(examen.id)}
                    />
                ))}
            </div>
            {totalPages > 1 && (
                <div className="flex items-center justify-between gap-4 py-4 border-t border-border-primary">
                    <Button variant="secondary" onClick={goToPrev} disabled={currentPage === 1}>
                        Anterior
                    </Button>

                    <span className="text-sm font-medium text-text-secondary">
                        Página <span className="text-text-primary">{currentPage}</span> de{' '}
                        {totalPages}
                    </span>
                    <Button
                        variant="secondary"
                        onClick={goToNext}
                        disabled={currentPage === totalPages}
                    >
                        Siguiente
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ExamenList;
