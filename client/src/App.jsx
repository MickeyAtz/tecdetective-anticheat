import { useState } from 'react';
import Button from '@/components/atoms/Button.jsx';
import Form from './components/molecules/Form';
import Badge from '@/components/atoms/Badge.jsx';
import StudentList from '@/components/molecules/StudentList.jsx';
import Card from '@/components/molecules/Card';
import Modal from '@/components/atoms/Modal';

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const STUDENTS_MOCK = [
        {
            id: 'st-001',
            nombre: 'Miguel Ángel Álvarez',
            status: 'success',
            incidents: [], // Caso: Sin incidentes
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
                    descripcion:
                        'Se detectó una segunda persona en el encuadre.',
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

    return (
        <>
            <Card
                title="Lista de estudiantes"
                subtitle="Monitoreo de estudiantes"
            >
                <StudentList students={STUDENTS_MOCK}></StudentList>
            </Card>
             <Button onClick={() => setIsModalOpen(true)} variant="primary">
                Abrir modal
            </Button>
            <Button onClick={() => setIsModalOpen(true)} variant="secondary">
                Abrir modal
            </Button>
             <Button onClick={() => setIsModalOpen(true)} variant="ghost">
                Abrir modal
            </Button>
            <Modal
                title="Este es un modal de prueba"
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Omnis
                maiores aperiam sunt doloremque ut nesciunt blanditiis ex
                voluptatibus vitae? Quaerat, minima iusto. Sapiente ab deserunt
                quia facere pariatur perspiciatis soluta. Veritatis facere enim
                autem, velit nulla tempora dicta libero cumque iste ex vel
                temporibus hic consectetur consequuntur mollitia voluptatibus
                facilis accusamus voluptas dolorum quasi dolores sed beatae
                assumenda. Corporis, eius. Fuga inventore aliquid unde
                blanditiis quam itaque culpa, suscipit officiis voluptate natus
                sapiente voluptatum ipsam possimus repudiandae repellat
                cupiditate excepturi sint laborum in quia labore asperiores
                praesentium soluta dolore! Placeat? Nisi, explicabo dolore,
                commodi molestias debitis voluptatibus voluptatum ducimus iste
                deleniti obcaecati rerum quidem officia enim. Nobis harum
                praesentium ratione molestias nulla nesciunt ipsam tenetur
                delectus? Ab nam fugit consequuntur. Officiis aliquam hic ipsa
                exercitationem! Earum, architecto nobis omnis nihil commodi
                corrupti, magnam aut laborum iste fuga reprehenderit dolorum
                dicta reiciendis, modi quibusdam ipsum! Ex tempora eum ducimus
                delectus cumque.
            </Modal>
        </>
    );
}

export default App;
