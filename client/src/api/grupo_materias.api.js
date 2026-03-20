import axiosInstance from './axiosInstance';

export const getMateriasAsignadas = async (idGrupo) =>
    (await axiosInstance.get(`/grupo_materias/${idGrupo}`)).data;

export const getMateriasDisponibles = async (idGrupo) =>
    (await axiosInstance.get(`/grupo_materias/disponibles/${idGrupo}`)).data;

export const asignarMateria = async (idGrupo, idMateria) =>
    (await axiosInstance.post(`/grupo_materias/asignar/${idGrupo}/${idMateria}`)).data;

export const deleteAsignacion = async (idGrupo, idMateria) =>
    (await axiosInstance.delete(`/grupo_materias/${idGrupo}/${idMateria}`)).data;
