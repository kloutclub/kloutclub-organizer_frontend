import axios from 'axios';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const fetchAllSponsors = async (token: string | null) => {
    try{
        const response = await axios.post(`${apiBaseUrl}/api/totalsponsors`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;
    }catch(error){
        throw error;
    }
}