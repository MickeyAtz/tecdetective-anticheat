import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importacion de componentes
import Button from '@/components/atoms/Button.jsx';
import Form from '@/components/molecules/Form';
import Badge from '@/components/atoms/Badge.jsx';
import StudentList from '@/components/molecules/StudentList.jsx';
import Card from '@/components/molecules/Card';
import Modal from '@/components/atoms/Modal';
import MainLayout from '@/components/templates/MainLayout';
// Importacion de mocks
import { STUDENTS_MOCK } from '@/mocks/students';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    // TODO creacion de paginas y agregarlas al router de react
                    <Route
                        index
                        element={
                            <StudentList students={STUDENTS_MOCK}></StudentList>
                        }
                    ></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
