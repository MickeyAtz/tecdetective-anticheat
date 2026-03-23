import axiosInstance from './axiosInstance';

export const createExamen = async (examenData) =>
    (await axiosInstance.post('/examen', examenData)).data;

export const getExamenes = async () => (await axiosInstance.get('/examen')).data;

