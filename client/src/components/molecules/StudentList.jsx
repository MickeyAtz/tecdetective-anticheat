import React, { useState, useMemo } from 'react';

// Importación de componentes
import StudentListItem from '@/components/molecules/StudentListItem';
import Button from '@/components/atoms/Button.jsx';

const StudentList = ({ students = [], header = '', onlyData = false, rowsPerPage = 25 }) => {
    const [currentPage, setCurrentPage] = useState(1);

    students.sort((a, b) => b.incidentes.length - a.incidentes.length);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return students.slice(startIndex, startIndex + rowsPerPage);
    });

    const totalPages = Math.ceil(students.length / rowsPerPage);

    return (
        <>
            <ul className="w-full bg-bg-primary">
                <h2 className="text-xl font-bold text-text-primary">{header}</h2>
                {paginatedData.map((student) => (
                    <StudentListItem
                        key={onlyData ? student.idParticipante : student.id}
                        student={student}
                        onlyData={onlyData}
                    ></StudentListItem>
                ))}
            </ul>
            <div className="flex flex-col sm:flex-row justify-between items-center  mt-6 pt-4 border-t border-border-primary">
                <div className="text-sm text-text-tertiary font-medium">
                    Página {currentPage} de {totalPages || 1}
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                        Anterior
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={currentPage === totalPages || totalPages === 0}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                        Siguiente
                    </Button>
                </div>
            </div>
        </>
    );
};

export default StudentList;
