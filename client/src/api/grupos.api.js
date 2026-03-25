import axiosInstance from './axiosInstance';

export const getGrupos = async () => (await axiosInstance.get('/grupo/')).data.grupos;

export const createGrupo = async (data) => (await axiosInstance.post('/grupo/', data)).data;

export const editGrupo = async (data, id) => (await axiosInstance.put(`/grupo/${id}`, data)).data;

export const deleteGrupo = async (id) => (await axiosInstance.put(`/grupo/baja/${id}`)).data;
