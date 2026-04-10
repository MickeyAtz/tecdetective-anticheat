import axios from 'axios';
import axiosInstance from './axiosInstance';

export const createExamen = async (examenData) =>
    (await axiosInstance.post('/examen', examenData)).data;

export const getExamenes = async () => (await axiosInstance.get('/examen')).data;

export const getExamenById = async (id) => (await axiosInstance.get(`/examen/${id}`)).data;

export const cambiarEstadoExamen = async (id, estado) =>
    (await axiosInstance.put(`/examen/${id}/estado`, { estado })).data;

export const modifyExamen = async (id, examenData) =>
    (await axiosInstance.put(`/examen/${id}`, examenData)).data;

export const deleteExamen = async (id) =>
    (await axiosInstance.delete(`/examen/${id}`)).data;

export const getHistorialExamen = async (id) =>
    (await axiosInstance.get(`/examen/resultados/${id}`)).data;

export const getParticipantesEIncidentesByExamen = async (id) =>
    (await axiosInstance.get(`/examen/monitoreo/${id}`)).data;   
