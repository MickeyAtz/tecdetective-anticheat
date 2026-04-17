import axiosInstance from './axiosInstance.js';

export const getDashboardData = async () => {
    const response = await axiosInstance.get('/dashboard/summary');
    return response.data;
};
