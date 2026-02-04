import React from 'react';

// Importación de componentes
import StudentListItem from '@/components/molecules/StudentListItem';

const StudentList = ({ students }) => {
    const listStyle = `max-w-3xl mx-auto p-6 bg-bg-primary`;
    const headerStyle = `text-xl font-bold text-text-primary`;

    return (
        <ul className={listStyle}>
            <h2 className={headerStyle}>Monitoreo de Alumnos</h2>
            {students.map((student) => (
                <StudentListItem
                    key={student.id}
                    student={student}
                ></StudentListItem>
            ))}
        </ul>
    );
};

export default StudentList;
