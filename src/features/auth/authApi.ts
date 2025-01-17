import axios from "axios";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

type loginParams = {
    email: string,
    password: string
}

export const fetchLogin = async ({ email, password }: loginParams) => {
    try {
        const response = await axios.post(`${apiBaseUrl}/api/login`, { email, password }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // console.log(response.data);
        return response.data;
    } catch (error) {
        // console.log(error);
        throw error;
    }
}

export const fetchUserApi = async (token: string | null) => {
    try {
        const response = await axios.post(`${apiBaseUrl}/api/profile`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}