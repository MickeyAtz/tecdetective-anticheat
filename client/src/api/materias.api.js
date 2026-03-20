import axiosInstance from './axiosInstance';

export const getMaterias = async () => (await axiosInstance.get('/materia/')).data;

export const createMateria = async (data) => await axiosInstance.post('/materia/', data).data;

export const modifyMateria = async (data, id) =>
    (await axiosInstance.put(`/materia/${id}`, data)).data;

export const deleteMateria = async (id) => (await axiosInstance.put(`/materia/baja/${id}`)).data;
