import axios from '../api/axios.js';
import useAuth from './useAuth.js';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/auth/refresh', {
            withCredentials: true,
        });

        setAuth((prev) => {
            return { ...prev, accessToken: response.data.accessToken };
        });

        return response.data.accessToken;
    };

    return refresh;
};

export default useRefreshToken;
