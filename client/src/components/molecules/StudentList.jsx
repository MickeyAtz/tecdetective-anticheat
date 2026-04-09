import React from 'react';

// Importación de componentes
import StudentListItem from '@/components/molecules/StudentListItem';

const StudentList = ({ students, header = '', onlyData = false }) => {
    return (
        <ul className="w-full bg-bg-primary">
            <h2 className="text-xl font-bold text-text-primary">{header}</h2>
            {students.map((student) => (
                <StudentListItem
                    key={onlyData ? student.idParticipante : student.id}
                    student={student}
                    onlyData={onlyData}
                ></StudentListItem>
            ))}
        </ul>
    );
};

export default StudentList;
