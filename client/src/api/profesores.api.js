import axiosInstance from './axiosInstance';

export const editProfesor = async (data) => (await axiosInstance.put(`/profesor/`, data)).data;

export const editPassword = async (data) =>
    (await axiosInstance.put(`/profesor/password/update`, data)).data;
