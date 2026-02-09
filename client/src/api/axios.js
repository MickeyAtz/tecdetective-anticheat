import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

// Creación de instancia de Axios
export default axios.create({
    baseURL: BASE_URL,
});

// Instancia privada de Axios
export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-type': 'application/json' },
    withCredentials: true,
});
